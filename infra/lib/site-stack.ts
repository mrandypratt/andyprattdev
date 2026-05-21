import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

const DOMAIN_NAME = 'andyprattdev.com';
const WWW_NAME = `www.${DOMAIN_NAME}`;

const REDIRECT_FUNCTION_CODE = `function handler(event) {
  var request = event.request;
  var host = request.headers.host && request.headers.host.value;
  if (host === '${WWW_NAME}') {
    var qs = '';
    if (request.querystring && Object.keys(request.querystring).length) {
      qs = '?' + Object.keys(request.querystring).map(function (k) {
        return k + '=' + request.querystring[k].value;
      }).join('&');
    }
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://${DOMAIN_NAME}' + request.uri + qs } }
    };
  }
  return request;
}`;

export class AndyPrattDevSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: DOMAIN_NAME,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
    });

    const oac = new cloudfront.S3OriginAccessControl(this, 'BucketOAC', {
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
      originAccessControl: oac,
    });

    const wwwToApexRedirect = new cloudfront.Function(this, 'WwwToApexRedirect', {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromInline(REDIRECT_FUNCTION_CODE),
    });

    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultRootObject: 'index.html',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          {
            function: wwwToApexRedirect,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
      ],
      // Stage 1: no domainNames / certificate yet — aliases still live on the legacy
      // distribution. Phase 7 adds these after stripping aliases from the old one.
    });

    const zone = new route53.HostedZone(this, 'Zone', { zoneName: DOMAIN_NAME });

    const cfTarget = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));

    new route53.ARecord(this, 'ApexA', {
      zone,
      recordName: DOMAIN_NAME,
      target: cfTarget,
    });
    new route53.AaaaRecord(this, 'ApexAAAA', {
      zone,
      recordName: DOMAIN_NAME,
      target: cfTarget,
    });
    new route53.ARecord(this, 'WwwA', {
      zone,
      recordName: WWW_NAME,
      target: cfTarget,
    });
    new route53.AaaaRecord(this, 'WwwAAAA', {
      zone,
      recordName: WWW_NAME,
      target: cfTarget,
    });

    new route53.CnameRecord(this, 'AcmApexValidation', {
      zone,
      recordName: '_5f507524096e8cb13f6f90d2d8f1c59e.andyprattdev.com.',
      domainName: '_3a1d96cd556721e53357db39a640b5cd.zxwlrjxpwn.acm-validations.aws.',
    });
    new route53.CnameRecord(this, 'AcmWwwValidation', {
      zone,
      recordName: '_0ce30a398e99148d1681ad5611effba2.www.andyprattdev.com.',
      domainName: '_635d3d0855e5acc7122d135302cc415b.zxwlrjxpwn.acm-validations.aws.',
    });

    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new cdk.CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName });
    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'HostedZoneId', { value: zone.hostedZoneId });
    new cdk.CfnOutput(this, 'HostedZoneNameServers', {
      value: cdk.Fn.join(',', zone.hostedZoneNameServers ?? []),
    });
  }
}

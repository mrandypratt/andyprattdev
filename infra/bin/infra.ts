#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { AndyPrattDevSiteStack } from '../lib/site-stack';

const app = new cdk.App();
new AndyPrattDevSiteStack(app, 'AndyPrattDevSite', {
  env: { account: '730586623447', region: 'us-east-1' },
});

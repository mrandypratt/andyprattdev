import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import "../styles/Footer.css"

export const Footer = () => {

  return (
    <footer className="footer">

      <div className="footer-title">
        <h3 className="footer-header">Let's talk tech!</h3>
      </div>

      <div className="footer-content">
        <a className="footer-links" href="mailto:mrandypratt@gmail.com" target="_blank" rel="noreferrer noopener" style={{margin: 10}}>
          <EmailIcon fontSize='large' color="inherit" />
        </a>

        <a className="footer-links" href="https://github.com/mrandypratt" target="_blank" rel="noreferrer noopener" style={{margin: 10}}>
          <GitHubIcon fontSize='large' color="inherit" />
        </a>

        <a className="footer-links" href="https://www.linkedin.com/in/andrewpratt37/" target="_blank" rel="noreferrer noopener" style={{margin: 10}}>
          <LinkedInIcon fontSize='large' color="inherit" />
        </a>
      </div>
    </footer>
  )
}

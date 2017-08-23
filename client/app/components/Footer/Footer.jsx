import React from 'react';
import styles from './Footer.css'
const Footer = () => {
  return (
    <div className={ styles.footerContainer } >
      <div className = { styles.footer } >
          Built using React by <a href="https://tmattlee.github.io"
          style = { { textDecoration:'none',color: 'orange' } } > Matt Lee </a>
        </div>
        <div className = { styles.footer } >
          <a href="https://github.com/TMattLee/stock-app"
          style = { { textDecoration:'none',color: 'orange' } } >
            View Source 
          </a>
        </div>
    </div>
  );
}

export default Footer;
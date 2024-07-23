import React from "react";
import "../styles/footer.css";
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <p>&copy; 2024 Turners Cars. All rights reserved.</p>
        <ul className="footer-links">
          <li>
            <a href="#privacy-policy">Privacy Policy</a>
          </li>
          <li>
            <a href="#terms-of-use">Terms of Use</a>
          </li>
          <li>
            <a
              href="https://twitter.com/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </li>
          <li>
            <a
              href="https://facebook.com/yourcompany"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

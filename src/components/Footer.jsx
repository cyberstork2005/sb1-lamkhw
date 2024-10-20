import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <p>&copy; 2023 CyberStork.Co.,Ltd.. All rights reserved.</p>
          <p>株式会社サイバーストーク</p>
          <p>〒509-7201 岐阜県恵那市大井町2087-524</p>
          <p>Email: <a href="mailto:info@cyberstork.com">info@cyberstork.com</a></p>
        </div>
        <nav className="footer-nav">
          <Link to="/privacy">プライバシーポリシー</Link>
          <Link to="/terms">利用規約</Link>
          <Link to="/contact">お問い合わせ</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
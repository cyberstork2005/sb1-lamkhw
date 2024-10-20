import React from 'react';
import { Link } from 'react-router-dom';
import './CreatorRegistration.css';

function CreatorRegistration() {
  return (
    <div className="creator-registration">
      <h2>クリエイター登録</h2>
      <div className="message-container">
        <p className="preparation-message">
          クリエイター登録フォームは現在準備中です。再開までしばらくお待ちください。
        </p>
        <p>
          ご不便をおかけして申し訳ございません。準備が整い次第、こちらでお知らせいたします。
        </p>
        <p>
          <Link to="/" className="home-link">ホームページに戻る</Link>
        </p>
      </div>
    </div>
  );
}

export default CreatorRegistration;
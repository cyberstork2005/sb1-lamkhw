import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailVerification.css';

function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    if (!currentUserEmail) {
      navigate('/user-registration');
    } else {
      setEmail(currentUserEmail);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 確認コードを1234に固定
    if (verificationCode === '1234') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => 
        user.email === email ? { ...user, isVerified: true } : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.removeItem('currentUserEmail');
      
      // ユーザーを自動的にログイン状態にする
      const verifiedUser = updatedUsers.find(user => user.email === email);
      if (verifiedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(verifiedUser));
      }

      navigate('/design-upload');
    } else {
      setError('無効な確認コードです。');
    }
  };

  return (
    <div className="email-verification">
      <h2>メール確認</h2>
      <p>{email} 宛てに送信された確認コードを入力してください。</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="verificationCode">確認コード:</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">確認</button>
      </form>
    </div>
  );
}

export default EmailVerification;
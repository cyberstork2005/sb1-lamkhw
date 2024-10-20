import React, { useState } from 'react';
import './ChangePasswordModal.css';

function ChangePasswordModal({ onClose, onPasswordChanged }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 現在のパスワードを確認
    if (currentPassword !== 'password') { // 'password'は現在の管理者パスワード
      setError('現在のパスワードが正しくありません。');
      return;
    }

    // 新しいパスワードの確認
    if (newPassword !== confirmPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません。');
      return;
    }

    // パスワードの更新（実際のアプリケーションではここでAPIを呼び出します）
    localStorage.setItem('adminPassword', newPassword);
    onPasswordChanged();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>パスワード変更</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="currentPassword">現在のパスワード:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword">新しいパスワード:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">新しいパスワード（確認）:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit">変更</button>
            <button type="button" onClick={onClose}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordModal;
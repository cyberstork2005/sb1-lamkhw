import React, { useState } from 'react';
import './ReservationModal.css';

function ReservationModal({ design, onClose, onReservationComplete, maxQuantity }) {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onReservationComplete(design.id, { email, quantity });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>デザイン予約</h2>
        <h3>デザイン番号: {design.designNumber}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">メールアドレス:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="quantity">予約枚数 (最大{maxQuantity}枚):</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), maxQuantity))}
              min="1"
              max={maxQuantity}
              required
            />
          </div>
          <p className="reservation-message">
            ご予約ありがとうございます。後ほどご登録のメールアドレス宛に詳細な登録フォームをお送りいたします。
          </p>
          <p className="payment-info">
            お支払いはクレジットカード決済のみとなります。
          </p>
          <div className="button-group">
            <button type="submit">予約する</button>
            <button type="button" onClick={onClose}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationModal;
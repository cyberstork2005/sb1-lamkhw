import React from 'react';
import './ImageModal.css';

function ImageModal({ image, onClose }) {
  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content">
        <img src={image} alt="拡大画像" />
        <button className="close-button" onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

export default ImageModal;
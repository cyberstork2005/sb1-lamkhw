import React, { useState, useRef } from 'react';
import './EditDesignModal.css';

function EditDesignModal({ design, onClose, onEditComplete }) {
  const [price, setPrice] = useState(design.price);
  const [carModel, setCarModel] = useState(design.carModel);
  const [image, setImage] = useState(design.image);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDesign = {
      ...design,
      price: parseInt(price),
      carModel,
      image
    };
    onEditComplete(updatedDesign);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>デザイン編集</h2>
        <form onSubmit={handleSubmit}>
          <div className="image-upload" onClick={handleImageClick}>
            <img src={image} alt={`デザイン ${design.designNumber}`} className="design-image-preview" />
            <div className="image-upload-overlay">クリックして画像を変更</div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="designNumber">デザイン番号:</label>
            <input
              type="text"
              id="designNumber"
              value={design.designNumber}
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">価格:</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="carModel">対象車種:</label>
            <select
              id="carModel"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
            >
              <option value="jimny">ジムニーJB74</option>
              <option value="gryaris-gxpa16">GRヤリスGXPA16前期型</option>
              <option value="gryaris-mxpa12">GRヤリスMXPA12前期型</option>
              <option value="swift">スイフトZC33</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="update-button">更新</button>
            <button type="button" onClick={onClose} className="cancel-button">キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDesignModal;
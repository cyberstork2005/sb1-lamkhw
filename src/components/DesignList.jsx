import React, { useState } from 'react';
import './DesignList.css';

function DesignList() {
  const [designs, setDesigns] = useState([
    { id: 1, name: 'スポーティGRヤリス', creator: 'デザイナーA', price: 5000, buyers: 8, image: 'https://placehold.co/300x200?text=GRヤリスメーター', carModel: 'gryaris' },
    { id: 2, name: 'アドベンチャージムニー', creator: 'デザイナーB', price: 4500, buyers: 12, image: 'https://placehold.co/300x200?text=ジムニーメーター', carModel: 'jimny' },
    { id: 3, name: 'クラシックGRヤリス', creator: 'デザイナーC', price: 5500, buyers: 6, image: 'https://placehold.co/300x200?text=クラシックメーター', carModel: 'gryaris' },
    { id: 4, name: 'オフロードジムニー', creator: 'デザイナーD', price: 4800, buyers: 9, image: 'https://placehold.co/300x200?text=オフロードメーター', carModel: 'jimny' },
  ]);

  const [filter, setFilter] = useState('all');

  const filteredDesigns = filter === 'all' ? designs : designs.filter(design => design.carModel === filter);

  const handleReserve = (id) => {
    setDesigns(designs.map(design => 
      design.id === id ? { ...design, buyers: design.buyers + 1 } : design
    ));
  };

  return (
    <div className="design-list">
      <h2>カスタムメーターデザイン</h2>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>すべて</button>
        <button onClick={() => setFilter('jimny')} className={filter === 'jimny' ? 'active' : ''}>ジムニー</button>
        <button onClick={() => setFilter('gryaris')} className={filter === 'gryaris' ? 'active' : ''}>GRヤリス</button>
      </div>
      <div className="design-grid">
        {filteredDesigns.map(design => (
          <div key={design.id} className="design-item">
            <div className="design-image-container">
              <img src={design.image} alt={design.name} className="design-image" />
              {design.buyers >= 10 ? (
                <span className="sold-out-overlay">製品化決定</span>
              ) : (
                <span className="buyers-count">{design.buyers}/10 予約済</span>
              )}
            </div>
            <div className="design-info">
              <h3>{design.name}</h3>
              <p className="creator">by {design.creator}</p>
              <p className="price">¥{design.price.toLocaleString()}</p>
              {design.buyers < 10 && (
                <button className="reserve-button" onClick={() => handleReserve(design.id)}>予約する</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DesignList;
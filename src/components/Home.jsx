import React, { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';
import ReservationModal from './ReservationModal';
import ImageModal from './ImageModal';
import './Home.css';

function Home() {
  const [designs, setDesigns] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadDesigns = () => {
      const loadedDesigns = JSON.parse(localStorage.getItem('designs') || '[]');
      const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
      
      const updatedDesigns = loadedDesigns.map(design => {
        const designReservations = reservations.filter(r => r.designId === design.id);
        const totalBuyers = designReservations.reduce((sum, r) => sum + r.quantity, 0);
        return { ...design, buyers: totalBuyers };
      });

      setDesigns(updatedDesigns.filter(design => design.isApproved));
    };

    loadDesigns();
    const intervalId = setInterval(loadDesigns, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleReserve = (design) => {
    setSelectedDesign(design);
  };

  const handleReservationComplete = (designId, reservationData) => {
    const newReservation = {
      id: Date.now(),
      designId,
      ...reservationData
    };

    const currentReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const updatedReservations = [...currentReservations, newReservation];
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));

    setDesigns(prevDesigns => {
      const updatedDesigns = prevDesigns.map(design => {
        if (design.id === designId) {
          const newBuyers = design.buyers + reservationData.quantity;
          let updatedDesign = { ...design, buyers: newBuyers };
          
          if (design.buyers === 0 && newBuyers > 0) {
            const now = new Date();
            updatedDesign.startDate = now.toISOString();
            updatedDesign.endDate = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
          }
          
          return updatedDesign;
        }
        return design;
      });
      
      localStorage.setItem('designs', JSON.stringify(updatedDesigns));
      return updatedDesigns;
    });
    setSelectedDesign(null);
  };

  const handleCountdownEnd = (designId) => {
    setDesigns(prevDesigns => {
      const updatedDesigns = prevDesigns.map(design => {
        if (design.id === designId && design.buyers < 10) {
          return { ...design, buyers: 0, startDate: null, endDate: null };
        }
        return design;
      });
      localStorage.setItem('designs', JSON.stringify(updatedDesigns));
      return updatedDesigns;
    });
  };

  const getCarModelName = (carModel) => {
    switch(carModel) {
      case 'jimny':
        return 'ジムニーJB74';
      case 'gryaris-gxpa16':
        return 'GRヤリスGXPA16前期型';
      case 'gryaris-mxpa12':
        return 'GRヤリスMXPA12前期型';
      case 'swift':
        return 'スイフトZC33';
      default:
        return carModel;
    }
  };

  const filteredDesigns = filter === 'all' ? designs : designs.filter(design => design.carModel === filter);

  return (
    <div className="home">
      <h2>カスタムメーターデザイン</h2>
      <div className="product-info">
        <h3>製品情報</h3>
        <p><strong>限定生産について：</strong>定番製品以外は全て限定生産です。再販の予定はございませんので、お気に入りのデザインはお早めにご予約ください。</p>
        <p><strong>製品化条件：</strong>各デザインは最大30枚まで生産可能です。10枚の予約で製品化が決定し、製造を開始します。</p>
        <p><strong>予約期間：</strong>最初の予約から10日間限定です。期間内に10枚に達しない場合、予約は自動的にキャンセルされます。</p>
        <p><strong>お届け時期：</strong>製品化決定（10枚達成）後、約1ヶ月でお届けいたします。</p>
        <p><strong>送料：</strong>全国一律770円（税込）です。</p>
      </div>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>すべて</button>
        <button onClick={() => setFilter('jimny')} className={filter === 'jimny' ? 'active' : ''}>ジムニーJB74</button>
        <button onClick={() => setFilter('gryaris-gxpa16')} className={filter === 'gryaris-gxpa16' ? 'active' : ''}>GRヤリスGXPA16</button>
        <button onClick={() => setFilter('gryaris-mxpa12')} className={filter === 'gryaris-mxpa12' ? 'active' : ''}>GRヤリスMXPA12</button>
        <button onClick={() => setFilter('swift')} className={filter === 'swift' ? 'active' : ''}>スイフトZC33</button>
      </div>
      <div className="design-grid">
        {filteredDesigns.map(design => (
          <div key={design.id} className="design-item">
            <div className="design-image-container">
              <img 
                src={design.image} 
                alt={`デザイン ${design.designNumber}`} 
                className="design-image" 
                onClick={() => setSelectedImage(design.image)}
              />
            </div>
            <div className="design-info">
              <h3>デザイン番号: {design.designNumber}</h3>
              <p className="car-model">適合車種: {getCarModelName(design.carModel)}</p>
              <p className="price">¥{design.price.toLocaleString()}</p>
              {design.buyers >= 10 && <p className="production-decided">製品化決定!</p>}
              <div className="progress-bar-container">
                <div className="progress-bar" style={{width: `${(design.buyers / 30) * 100}%`}}></div>
                <p className="buyers-count">{design.buyers}/30 個</p>
              </div>
              <CountdownTimer 
                startDate={design.startDate} 
                endDate={design.endDate} 
                buyers={design.buyers}
                onCountdownEnd={() => handleCountdownEnd(design.id)}
              />
              {design.buyers < 30 && (
                <button 
                  className="reserve-button" 
                  onClick={() => handleReserve(design)}
                >
                  予約する
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedDesign && (
        <ReservationModal
          design={selectedDesign}
          onClose={() => setSelectedDesign(null)}
          onReservationComplete={handleReservationComplete}
          maxQuantity={30 - selectedDesign.buyers}
        />
      )}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

export default Home;
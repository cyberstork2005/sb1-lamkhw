import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPage.css';
import EditDesignModal from './EditDesignModal';
import ChangePasswordModal from './ChangePasswordModal';
import JSZip from 'jszip';

function AdminPage() {
  const [designs, setDesigns] = useState([]);
  const [editingDesign, setEditingDesign] = useState(null);
  const [filter, setFilter] = useState('all');
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedDesignForDownload, setSelectedDesignForDownload] = useState(null);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const loadDesignsFromLocalStorage = useCallback(() => {
    const storedDesigns = JSON.parse(localStorage.getItem('designs') || '[]');
    return storedDesigns;
  }, []);

  const loadReservationsFromLocalStorage = useCallback(() => {
    const storedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    return storedReservations;
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.isAdmin) {
      navigate('/login');
    } else {
      const loadedDesigns = loadDesignsFromLocalStorage();
      const loadedReservations = loadReservationsFromLocalStorage();
      setDesigns(loadedDesigns);
      setReservations(loadedReservations);
    }
  }, [navigate, loadDesignsFromLocalStorage, loadReservationsFromLocalStorage]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleEdit = (design) => {
    setEditingDesign(design);
  };

  const handleEditComplete = (updatedDesign) => {
    const updatedDesigns = designs.map(d =>
      d.id === updatedDesign.id ? updatedDesign : d
    );
    setDesigns(updatedDesigns);
    localStorage.setItem('designs', JSON.stringify(updatedDesigns));
    setEditingDesign(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('このデザインを削除してもよろしいですか？')) {
      const updatedDesigns = designs.filter(d => d.id !== id);
      setDesigns(updatedDesigns);
      localStorage.setItem('designs', JSON.stringify(updatedDesigns));
    }
  };

  const handleApprove = (id) => {
    const updatedDesigns = designs.map(d =>
      d.id === id ? { ...d, isApproved: true } : d
    );
    setDesigns(updatedDesigns);
    localStorage.setItem('designs', JSON.stringify(updatedDesigns));
  };

  const handleDownload = async (design) => {
    setSelectedDesignForDownload(design);
    try {
      const zip = new JSZip();
      
      // Add image file
      const imageResponse = await fetch(design.image);
      const imageBlob = await imageResponse.blob();
      zip.file(`design_${design.designNumber}_image.jpg`, imageBlob);

      // Generate and download the zip file
      const content = await zip.generateAsync({type: "blob"});
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `design_${design.designNumber}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading design:', error);
      alert('デザインのダウンロード中にエラーが発生しました。');
    } finally {
      setSelectedDesignForDownload(null);
    }
  };

  const handleUpdateReservation = (reservationId, updates) => {
    const updatedReservations = reservations.map(reservation =>
      reservation.id === reservationId ? { ...reservation, ...updates } : reservation
    );
    setReservations(updatedReservations);
    localStorage.setItem('reservations', JSON.stringify(updatedReservations));

    // Update the buyers count for the corresponding design
    const updatedDesigns = designs.map(design => {
      const designReservations = updatedReservations.filter(r => r.designId === design.id);
      const totalBuyers = designReservations.reduce((sum, r) => sum + r.quantity, 0);
      return { ...design, buyers: totalBuyers };
    });
    setDesigns(updatedDesigns);
    localStorage.setItem('designs', JSON.stringify(updatedDesigns));
  };

  const handleCancelReservation = (reservationId) => {
    if (window.confirm('この予約をキャンセルしてもよろしいですか？')) {
      const updatedReservations = reservations.filter(r => r.id !== reservationId);
      setReservations(updatedReservations);
      localStorage.setItem('reservations', JSON.stringify(updatedReservations));

      // Update the buyers count for the corresponding design
      const updatedDesigns = designs.map(design => {
        const designReservations = updatedReservations.filter(r => r.designId === design.id);
        const totalBuyers = designReservations.reduce((sum, r) => sum + r.quantity, 0);
        return { ...design, buyers: totalBuyers };
      });
      setDesigns(updatedDesigns);
      localStorage.setItem('designs', JSON.stringify(updatedDesigns));
    }
  };

  const togglePaymentStatus = (reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    const newStatus = reservation.paymentStatus === 'paid' ? 'pending' : 'paid';
    handleUpdateReservation(reservationId, { paymentStatus: newStatus });
  };

  const toggleEmailStatus = (reservationId) => {
    const reservation = reservations.find(r => r.id === reservationId);
    const newStatus = reservation.emailStatus === 'sent' ? 'not_sent' : 'sent';
    handleUpdateReservation(reservationId, { emailStatus: newStatus });
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

  const filteredDesigns = filter === 'all' ? designs : designs.filter(d => d.isApproved === (filter === 'approved'));

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>管理ページ</h1>
        <div className="admin-controls">
          <Link to="/" className="home-button">ホーム</Link>
          <button onClick={() => setIsChangePasswordModalOpen(true)} className="change-password-button">パスワード変更</button>
          <button onClick={handleLogout} className="logout-button">ログアウト</button>
        </div>
      </div>

      <h2>予約状況</h2>
      <div className="reservations-list">
        <table>
          <thead>
            <tr>
              <th>デザイン番号</th>
              <th>メールアドレス</th>
              <th>数量</th>
              <th>支払い状況</th>
              <th>メール送信状況</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => {
              const design = designs.find(d => d.id === reservation.designId);
              return (
                <tr key={reservation.id}>
                  <td>{design ? design.designNumber : 'N/A'}</td>
                  <td>{reservation.email}</td>
                  <td>
                    <input
                      type="number"
                      value={reservation.quantity}
                      onChange={(e) => handleUpdateReservation(reservation.id, { quantity: parseInt(e.target.value) })}
                      min="1"
                    />
                  </td>
                  <td>
                    <button
                      className={`status-button ${reservation.paymentStatus === 'paid' ? 'paid' : 'pending'}`}
                      onClick={() => togglePaymentStatus(reservation.id)}
                    >
                      {reservation.paymentStatus === 'paid' ? '支払い済み' : '未払い'}
                    </button>
                  </td>
                  <td>
                    <button
                      className={`status-button ${reservation.emailStatus === 'sent' ? 'sent' : 'not-sent'}`}
                      onClick={() => toggleEmailStatus(reservation.id)}
                    >
                      {reservation.emailStatus === 'sent' ? '送信済み' : '未送信'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleCancelReservation(reservation.id)}>キャンセル</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>デザイン一覧</h2>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>すべて</button>
        <button onClick={() => setFilter('approved')} className={filter === 'approved' ? 'active' : ''}>承認済み</button>
        <button onClick={() => setFilter('unapproved')} className={filter === 'unapproved' ? 'active' : ''}>未承認</button>
      </div>
      <div className="design-cards">
        {filteredDesigns.map(design => (
          <div key={design.id} className="design-card">
            <img 
              src={design.image} 
              alt={`デザイン ${design.designNumber}`} 
              className="design-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
              }}
            />
            <div className="design-info">
              <h3>デザイン番号: {design.designNumber}</h3>
              <p>価格: ¥{design.price.toLocaleString()}</p>
              <p>対象車種: {getCarModelName(design.carModel)}</p>
              <p>予約数: {design.buyers}</p>
              <p>ステータス: {design.isApproved ? '承認済み' : '未承認'}</p>
            </div>
            <div className="design-actions">
              <button onClick={() => handleEdit(design)} className="edit-button">編集</button>
              <button onClick={() => handleDelete(design.id)} className="delete-button">削除</button>
              {!design.isApproved && (
                <button onClick={() => handleApprove(design.id)} className="approve-button">承認</button>
              )}
              <button onClick={() => handleDownload(design)} className="download-button">
                {selectedDesignForDownload === design ? 'ダウンロード中...' : 'ダウンロード'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {editingDesign && (
        <EditDesignModal
          design={editingDesign}
          onClose={() => setEditingDesign(null)}
          onEditComplete={handleEditComplete}
        />
      )}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          onClose={() => setIsChangePasswordModalOpen(false)}
          onPasswordChanged={() => {
            setIsChangePasswordModalOpen(false);
            alert('パスワードが正常に変更されました。');
          }}
        />
      )}
    </div>
  );
}

export default AdminPage;
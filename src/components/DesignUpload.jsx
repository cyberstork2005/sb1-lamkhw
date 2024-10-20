import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './DesignUpload.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function DesignUpload() {
  const [carModel, setCarModel] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [formats, setFormats] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    loadFormats();
  }, []);

  const loadFormats = () => {
    const storedFormats = localStorage.getItem('designFormats');
    if (storedFormats) {
      setFormats(JSON.parse(storedFormats));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setError('デザインをアップロードするにはログインが必要です。');
      return;
    }
    if (imageFile) {
      try {
        const imageData = await readFileAsDataURL(imageFile);

        const newDesign = {
          id: Date.now(),
          designNumber: await getNextDesignNumber(),
          price: parseInt(price),
          buyers: 0,
          image: imageData,
          carModel: carModel,
          createdAt: new Date().toISOString(),
          isApproved: false,
          email: JSON.parse(localStorage.getItem('loggedInUser')).email
        };
        
        await addDesignToLocalStorage(newDesign);
        alert('デザインがアップロードされました。承認後に公開されます。');
        navigate('/');
      } catch (error) {
        setError(`ファイルの処理中にエラーが発生しました: ${error.message}`);
      }
    } else {
      setError('画像ファイルをアップロードしてください。');
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  const getNextDesignNumber = async () => {
    const designs = JSON.parse(localStorage.getItem('designs') || '[]');
    const maxDesignNumber = designs.reduce((max, design) => {
      const num = parseInt(design.designNumber.slice(1));
      return num > max ? num : max;
    }, 0);
    return `D${(maxDesignNumber + 1).toString().padStart(3, '0')}`;
  };

  const addDesignToLocalStorage = async (newDesign) => {
    const designs = JSON.parse(localStorage.getItem('designs') || '[]');
    designs.push(newDesign);
    localStorage.setItem('designs', JSON.stringify(designs));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= MAX_FILE_SIZE) {
      setImageFile(file);
    } else {
      setError('画像ファイルのサイズは10MB以下にしてください。');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="design-upload">
        <h2>デザインをアップロード</h2>
        <p>デザインをアップロードするにはログインが必要です。</p>
        <Link to="/login" className="login-link">ログインする</Link>
      </div>
    );
  }

  return (
    <div className="design-upload">
      <h2>デザインをアップロード</h2>
      
      <div className="format-download">
        <h3>フォーマットのダウンロード</h3>
        {formats && formats.map((format, index) => (
          <button key={index} onClick={() => window.open(format.url, '_blank')}>
            {format.name}をダウンロード
          </button>
        ))}
      </div>

      <div className="upload-instructions">
        <h3>アップロード手順</h3>
        <ol>
          <li>適切なフォーマットをダウンロードし、デザインを作成してください。</li>
          <li>以下のフォームに必要な情報を入力し、ファイルをアップロードしてください。</li>
        </ol>
      </div>

      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="carModel">対象車種:</label>
          <select
            id="carModel"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            required
          >
            <option value="">選択してください</option>
            <option value="jimny">ジムニーJB74</option>
            <option value="gryaris-gxpa16">GRヤリスGXPA16前期型</option>
            <option value="gryaris-mxpa12">GRヤリスMXPA12前期型</option>
            <option value="swift">スイフトZC33</option>
          </select>
        </div>
        <div>
          <label htmlFor="price">価格:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="imageFile">画像ファイル:</label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit">アップロード</button>
      </form>
    </div>
  );
}

export default DesignUpload;
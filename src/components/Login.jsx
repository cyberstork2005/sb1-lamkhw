import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'nakada@cyberstork.com' && password === 'cshappy18') {
      const adminUser = { email, isAdmin: true };
      localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
      navigate('/admin');
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        navigate('/');
      } else {
        setError('メールアドレスまたはパスワードが間違っています。');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>ログイン</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="show-password-button"
            >
              {showPassword ? "隠す" : "表示"}
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">ログイン</button>
      </form>
      <p className="auth-link">
        アカウントをお持ちでない方は
        <Link to="/user-registration">こちらから登録</Link>
      </p>
    </div>
  );
}

export default Login;
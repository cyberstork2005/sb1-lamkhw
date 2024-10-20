import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import DesignUpload from './components/DesignUpload';
import About from './components/About';
import Footer from './components/Footer';
import AdminPage from './components/AdminPage';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import Login from './components/Login';
import UserRegistration from './components/UserRegistration';
import EmailVerification from './components/EmailVerification';
import TermsOfService from './components/TermsOfService';
import CreatorRegistration from './components/CreatorRegistration';
import Compatibility from './components/Compatibility';
import './App.css';

function PrivateRoute({ children }) {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const isAdmin = loggedInUser && loggedInUser.isAdmin;
  return isAdmin ? children : <Navigate to="/login" />;
}

function App() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const isAdmin = loggedInUser && loggedInUser.isAdmin;

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app">
        <header>
          <div className="header-content">
            <h1>カスタムメーターデザイン</h1>
            <nav>
              <ul>
                <li><Link to="/">ホーム</Link></li>
                <li><Link to="/design-upload">デザインアップロード</Link></li>
                <li><Link to="/about">サービスについて</Link></li>
                <li><Link to="/compatibility">適合車種</Link></li>
                {loggedInUser ? (
                  <>
                    <li><span>ようこそ、{loggedInUser.email}さん</span></li>
                    {isAdmin && <li><Link to="/admin">管理者ページ</Link></li>}
                    <li><button onClick={handleLogout}>ログアウト</button></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login">ログイン</Link></li>
                    <li><Link to="/creator-registration">クリエイター登録</Link></li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/creator-registration" element={<CreatorRegistration />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/design-upload" element={<DesignUpload />} />
            <Route path="/about" element={<About />} />
            <Route path="/compatibility" element={<Compatibility />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            } />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
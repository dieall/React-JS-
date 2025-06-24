import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function HomePage() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Cek jika user sudah login
    const user = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    
    setUserInfo(user);
  }, []);

  return (
    <>
      <Header />
      <div className="page home-page">
        <div className="container">
          <div className="hero-section">
            <h1>Selamat Datang di Aplikasi Login</h1>
            <p>Aplikasi dengan sistem login berdasarkan role</p>
            
            {!userInfo ? (
              <div className="cta-buttons">
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            ) : (
              <div className="dashboard-link">
                <Link 
                  to={userInfo.role === 'admin' ? '/admin' : '/user'} 
                  className="btn btn-primary"
                >
                  Ke Dashboard
                </Link>
              </div>
            )}
          </div>
          
          <div className="features-section">
            <h2>Fitur Aplikasi</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Login Berdasarkan Role</h3>
                <p>Login sebagai admin atau user biasa</p>
              </div>
              <div className="feature-card">
                <h3>Dashboard Admin</h3>
                <p>Akses khusus untuk admin</p>
              </div>
              <div className="feature-card">
                <h3>Dashboard User</h3>
                <p>Akses khusus untuk user</p>
              </div>
              <div className="feature-card">
                <h3>Keamanan</h3>
                <p>Dilengkapi dengan JWT dan enkripsi password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage; 
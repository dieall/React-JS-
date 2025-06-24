import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    setUserInfo(user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Login App</Link>
      </div>
      <nav>
        <ul className="nav-links">
          {userInfo ? (
            <>
              <li>
                <span>Halo, {userInfo.name}</span>
              </li>
              <li>
                {userInfo.role === 'admin' ? (
                  <Link to="/admin">Dashboard Admin</Link>
                ) : (
                  <Link to="/user">Dashboard User</Link>
                )}
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header; 
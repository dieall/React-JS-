import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Cek jika user sudah login
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
      
    if (userInfo) {
      // Redirect berdasarkan role
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [navigate]);

  return (
    <div className="page login-page">
      <div className="container">
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage; 
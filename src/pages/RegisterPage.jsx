import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
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
    <div className="page register-page">
      <div className="container">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage; 
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Mencoba login dengan:', { email, password });
      
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      
      console.log('Respons login berhasil:', data);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect berdasarkan role
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
      
    } catch (error) {
      console.error('Error login:', error);
      console.error('Error response:', error.response);
      
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Login gagal, silakan coba lagi'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      
      <p>
        Belum punya akun? <Link to="/register">Daftar di sini</Link>
      </p>
    </div>
  );
}

export default LoginForm; 
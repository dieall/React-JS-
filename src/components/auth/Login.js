import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo('Mencoba login...');

    try {
      const response = await AuthService.login(email, password);
      setDebugInfo('Login berhasil: ' + JSON.stringify(response));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setDebugInfo('Error: ' + JSON.stringify(err.response || err.message || err));
      setError(
        err.response?.data?.message ||
        'Login gagal. Silakan periksa email dan password Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      setDebugInfo('Testing connection...');
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'OPTIONS'
      });
      setDebugInfo('Connection test result: ' + response.status + ' ' + response.statusText);
    } catch (err) {
      setDebugInfo('Connection test error: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login Admin</h2>
        <p className="subtitle">Sistem Informasi Pendidikan</p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="debug-section" style={{ marginTop: '20px' }}>
          <button 
            onClick={testConnection}
            className="btn btn-secondary btn-sm"
          >
            Test Connection
          </button>
          {debugInfo && (
            <div className="debug-info" style={{ marginTop: '10px', fontSize: '12px', wordBreak: 'break-all' }}>
              <pre>{debugInfo}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 
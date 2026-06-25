import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../AuthContext';
import Navbar from '../components/Navbar';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await api.login({ username, password });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1.5rem' }}>
        <form className="card animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }} onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>
          
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.25rem', marginBottom: '1rem' }}>{error}</div>}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required 
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.25rem', background: 'var(--bg-color)', border: '1px solid var(--glass-border)', color: 'white' }} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
          
          <p style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)' }}>Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

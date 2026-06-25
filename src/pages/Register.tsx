import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Navbar from '../components/Navbar';
import { Mail, Key, User, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../api';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [resendTimer, setResendTimer] = useState(0);

  // Handle countdown timer for Resend button
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.sendCode({ email });
      setStep(2);
      setResendTimer(60); // 60 seconds cooldown
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.register({ email, code, username, password });
      login(res.token, res.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar />
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="card glass" 
          style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}
        >
          <h2 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            {step === 1 ? "Enter your email to get started" : step === 2 ? "Check your email for the code" : "Choose your credentials"}
          </p>

          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '0.5rem', borderRadius: '0.25rem' }}>{error}</div>}
          
          {step === 1 && (
            <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                {loading ? 'Sending...' : 'Send Verification Code'} <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={() => setStep(3)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <Key size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="6-Digit Code" 
                  value={code} 
                  onChange={e => setCode(e.target.value)} 
                  required 
                  className="form-input"
                  style={{ paddingLeft: '3rem', letterSpacing: '0.25em', textAlign: 'center' }}
                  maxLength={6}
                />
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
                Code expires in 15 minutes.
              </p>
              <button type="button" onClick={() => setStep(3)} disabled={code.length !== 6} className="btn btn-primary">
                Verify Code
              </button>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => handleSendCode()} 
                  disabled={resendTimer > 0 || loading} 
                  className="btn btn-glass" 
                  style={{ flex: 1 }}
                >
                  {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                </button>
                <button type="button" onClick={() => setStep(1)} className="btn btn-glass" style={{ flex: 1 }}>
                  Change Email
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ position: 'relative' }}>
                <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username} 
                  onChange={e => setUsername(e.target.value)} 
                  required 
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="form-input"
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem' }}>
                {loading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Login</Link>
          </div>
        </motion.div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--glass-border);
          color: white;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
      `}</style>
    </motion.div>
  );
};

export default Register;

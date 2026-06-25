import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, Coins, LogOut, Settings, User } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="manga-panel" 
      style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0', borderBottom: 'var(--panel-border)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: '0' }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.5 }}>
            <BookOpen className="text-gradient" style={{ color: 'var(--accent-primary)' }} size={28} />
          </motion.div>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
            Toon<span className="text-gradient">Read</span>
          </span>
        </Link>
        
        <div style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="md-flex">
          <motion.div whileHover={{ scale: 1.1, color: 'var(--accent-primary)' }}>
            <Link to="/" style={{ fontWeight: 500 }}>Home</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, color: 'var(--accent-primary)' }}>
            <Link to="/browse" style={{ fontWeight: 500 }}>Browse</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1, color: '#fbbf24' }}>
            <Link to="/store" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Coins size={16} /> Get Coins
            </Link>
          </motion.div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-glass md-none" style={{ padding: '0.5rem', display: 'block' }}>
            <Menu size={20} />
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="md-flex">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}
              >
                <Coins size={16} style={{ color: '#fbbf24' }} />
                <span style={{ fontWeight: 600 }}>{user.coins}</span>
              </motion.div>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)' }}
                  title="My Profile"
                >
                  <User size={18} color="white" />
                </motion.div>
              </Link>
              
              {user.role === 'admin' && (
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Link to="/admin" className="btn btn-glass" style={{ padding: '0.5rem' }} title="Admin Dashboard">
                    <Settings size={20} />
                  </Link>
                </motion.div>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                onClick={handleLogout} 
                className="btn btn-glass" 
                style={{ padding: '0.5rem' }} 
                title="Logout"
              >
                <LogOut size={20} />
              </motion.button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }} className="md-flex">
               <motion.div whileHover={{ scale: 1.05 }}><Link to="/login" className="btn btn-glass">Login</Link></motion.div>
               <motion.div whileHover={{ scale: 1.05 }}><Link to="/register" className="btn btn-primary">Register</Link></motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

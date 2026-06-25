import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--bg-secondary)', padding: '2rem', marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none' }}>
          <BookOpen className="text-gradient" size={24} />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>ToonRead</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms & Conditions</Link>
          <Link to="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
          <Link to="/refund" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Refund Policy</Link>
          <Link to="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</Link>
        </div>
        
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem' }}>
          &copy; {new Date().getFullYear()} ToonRead. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Contact: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1.5rem', flex: 1, maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem' }}>Contact Us</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '2rem' }}>We would love to hear from you! Whether you have a question about payments, features, or anything else, our team is ready to answer all your questions.</p>
          
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Support Email</h3>
            <p>You can reach our support team directly at:</p>
            <a href="mailto:support@toonread.com" style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 600, textDecoration: 'none' }}>support@toonread.com</a>
            
            <h3 style={{ color: 'var(--text-primary)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Business Inquiries</h3>
            <p>For creator partnerships and business opportunities:</p>
            <a href="mailto:business@toonread.com" style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 600, textDecoration: 'none' }}>business@toonread.com</a>
          </div>
          
          <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>* We typically respond to all support inquiries within 24-48 business hours.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;

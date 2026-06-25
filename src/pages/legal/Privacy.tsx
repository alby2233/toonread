import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Privacy: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1.5rem', flex: 1, maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account (username, email address, password). We may also collect payment information when you purchase virtual coins, though this is securely processed by our payment provider (Razorpay).</p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Information</h3>
          <p>We use the information to provide, maintain, and improve our services, process transactions, and communicate with you regarding your account or support requests.</p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h3>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;

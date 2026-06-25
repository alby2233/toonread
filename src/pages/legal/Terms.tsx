import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Terms: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1.5rem', flex: 1, maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem' }}>Terms & Conditions</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Introduction</h3>
          <p>Welcome to ToonRead. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Use of Service</h3>
          <p>ToonRead provides digital comics and reading materials. You must be at least 13 years old to use this service. Virtual coins purchased on the platform are non-transferable and can only be used to unlock content within the app.</p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. User Accounts</h3>
          <p>You are responsible for maintaining the confidentiality of your account credentials. Any activity occurring under your account is your responsibility.</p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Intellectual Property</h3>
          <p>All content uploaded by admins belongs to ToonRead or its respective creators. Users may not copy, distribute, or pirate content from the platform.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Refund: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1.5rem', flex: 1, maxWidth: '800px' }}>
        <h1 style={{ marginBottom: '2rem' }}>Cancellation & Refund Policy</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Digital Goods</h3>
          <p>ToonRead sells virtual coins which are considered digital goods. Because virtual coins are delivered instantly and applied directly to your account balance upon a successful transaction, we do not offer refunds or cancellations once a purchase is complete.</p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Exceptions</h3>
          <p>If you experience a technical error where your payment was successfully processed by your bank but the coins were not credited to your ToonRead account, please contact our support team immediately. Upon verification, we will manually credit the coins to your account or issue a refund if the credit cannot be applied.</p>
          
          <h3 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us for Support</h3>
          <p>If you encounter any payment issues, please reach out to us via the Contact Us page.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Refund;

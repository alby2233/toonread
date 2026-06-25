import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../AuthContext';
import Navbar from '../components/Navbar';
import { Coins, CheckCircle, XCircle } from 'lucide-react';

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Store: React.FC = () => {
  const { user, updateCoins } = useContext(AuthContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'success' | 'canceled' | 'verifying'>('idle');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [user, navigate]);

  const handleBuy = async (amount: number, coins: number) => {
    try {
      setStatus('verifying');
      // 1. Create order on backend
      const order = await api.createOrder(amount, coins);
      
      // 2. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_T5tmMhRTbnDpXG',
        amount: order.amount,
        currency: order.currency,
        name: 'ToonRead',
        description: `${coins} Coins Package`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              coinsAdded: coins,
              amount: amount
            });

            if (verifyRes.success) {
              updateCoins((user?.coins || 0) + verifyRes.coinsAdded);
              setStatus('success');
            }
          } catch (err) {
            console.error('Verification failed', err);
            setStatus('canceled');
          }
        },
        prefill: {
          name: user?.username || ''
        },
        theme: {
          color: '#8b5cf6'
        },
        modal: {
          ondismiss: function() {
            setStatus('canceled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setStatus('canceled');
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      alert('Failed to start checkout');
      setStatus('idle');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <Coins className="text-gradient" size={32} /> Get Coins
          <span style={{ background: '#ef4444', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: 800, marginLeft: '1rem', transform: 'rotate(-5deg)' }}>SALE!</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Buy coins to unlock premium chapters and support your favorite creators! Special Indian pricing available now.
        </p>

        {status === 'success' && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '1rem 2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            <CheckCircle size={24} /> Payment Successful! Coins have been added to your account.
          </div>
        )}
        
        {status === 'canceled' && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem 2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            <XCircle size={24} /> Payment was canceled or failed.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Package 1 */}
          <div className="card" style={{ padding: '2rem', width: '250px' }}>
            <Coins size={48} style={{ color: '#fbbf24', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>50 Coins</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Perfect for a few chapters</p>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>₹1.00</h3>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleBuy(100, 50)}>Buy Now</button>
          </div>

          {/* Package 2 */}
          <div className="card" style={{ padding: '2rem', width: '250px', border: '2px solid var(--accent-primary)', transform: 'scale(1.05)' }}>
            <div style={{ background: 'var(--accent-primary)', color: 'white', position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, 0)', padding: '0.25rem 1rem', borderRadius: '0 0 0.5rem 0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>MOST POPULAR</div>
            <Coins size={48} style={{ color: '#fbbf24', margin: '1rem auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>120 Coins</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Includes 20 bonus coins!</p>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>₹5.00</h3>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleBuy(500, 120)}>Buy Now</button>
          </div>

          {/* Package 3 */}
          <div className="card" style={{ padding: '2rem', width: '250px' }}>
            <Coins size={48} style={{ color: '#fbbf24', margin: '0 auto 1rem auto' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>300 Coins</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>For the true binge reader</p>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>₹10.00</h3>
            <button className="btn btn-glass" style={{ width: '100%' }} onClick={() => handleBuy(1000, 300)}>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;

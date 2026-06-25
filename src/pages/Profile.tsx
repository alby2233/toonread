import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../AuthContext';
import { api } from '../api';
import { motion } from 'framer-motion';
import { User, Coins, LogOut, Bookmark, Star } from 'lucide-react';
import type { Comic } from '../types';

interface ProfileData {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    coins: number;
  };
  bookmarks: (Comic & { savedAt: string })[];
}

const Profile: React.FC = () => {
  const { user: authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '2rem' }}>
          
          {/* Sidebar / User Info */}
          <div className="card glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'fit-content', background: 'rgba(15,23,42,0.8)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={40} color="white" />
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{profileData.user.username}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>{profileData.user.email}</p>
              <div style={{ marginTop: '0.5rem', display: 'inline-block', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                {profileData.user.role}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Coins size={20} color="#fbbf24" />
                <span style={{ fontWeight: 600 }}>Coin Balance</span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{profileData.user.coins}</span>
            </div>

            <Link to="/store" className="btn btn-primary" style={{ textAlign: 'center' }}>
              Top Up Coins
            </Link>

            <button onClick={handleLogout} className="btn btn-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto', color: '#ef4444' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>

          {/* Main Content (Bookmarks) */}
          <div className="card glass" style={{ padding: '2rem', background: 'rgba(15,23,42,0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <Bookmark size={24} className="text-gradient" />
              <h2 style={{ fontSize: '1.75rem' }}>My Library</h2>
            </div>

            {profileData.bookmarks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                <Bookmark size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p>You haven't added any comics to your library yet.</p>
                <Link to="/browse" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Browse Comics</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {profileData.bookmarks.map((comic) => (
                  <Link key={comic.id} to={`/comic/${comic.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card glass hover-glow" style={{ padding: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <img 
                        src={comic.coverUrl.startsWith('/uploads') ? `http://localhost:3000${comic.coverUrl}` : comic.coverUrl} 
                        alt={comic.title} 
                        style={{ width: '80px', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{comic.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>By {comic.author}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
                          <span style={{ background: 'var(--accent-primary)', padding: '0.1rem 0.5rem', borderRadius: '1rem', textTransform: 'uppercase' }}>{comic.type}</span>
                          <span style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Star size={14} fill="currentColor" /> {comic.rating}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>Saved on: {new Date(comic.savedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Profile;

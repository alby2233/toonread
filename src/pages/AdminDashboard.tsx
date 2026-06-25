import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { AuthContext } from '../AuthContext';
import { LayoutDashboard, BookPlus, UploadCloud, ArrowLeft, LogOut, FileText, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Comic } from '../types';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [message, setMessage] = useState('');
  
  // Data
  const [comics, setComics] = useState<Comic[]>([]);

  // Forms
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [type, setType] = useState('manhwa');
  const [synopsis, setSynopsis] = useState('');
  const [genres, setGenres] = useState('');
  const [cover, setCover] = useState<File | null>(null);

  const [comicId, setComicId] = useState('');
  const [chapterNumber, setChapterNumber] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('0');
  const [pages, setPages] = useState<FileList | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    // Fetch comics for the dropdown
    api.getComics().then(setComics).catch(console.error);
  }, [user, navigate]);

  const handleComicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('type', type);
    formData.append('synopsis', synopsis);
    formData.append('genres', JSON.stringify(genres.split(',').map(g => g.trim())));
    formData.append('status', 'Ongoing');
    if (cover) formData.append('cover', cover);

    try {
      const res = await api.uploadComic(formData);
      setMessage(`Comic uploaded successfully! ID: ${res.id}`);
      setTitle(''); setAuthor(''); setSynopsis(''); setGenres(''); setCover(null);
      // refresh comics
      api.getComics().then(setComics);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comicId) {
      setMessage('Please select a comic');
      return;
    }
    const formData = new FormData();
    formData.append('comicId', comicId);
    formData.append('number', chapterNumber);
    formData.append('title', chapterTitle);
    formData.append('date', new Date().toISOString().split('T')[0]);
    formData.append('isPremium', isPremium ? '1' : '0');
    formData.append('price', price);
    
    if (pages) {
      for (let i = 0; i < pages.length; i++) {
        formData.append('pages', pages[i]);
      }
    }

    try {
      const res = await api.uploadChapter(formData);
      setMessage(`Chapter uploaded successfully! ID: ${res.id}`);
      setComicId(''); setChapterNumber(''); setChapterTitle(''); setPages(null);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'transparent' }}>
      
      {/* Sidebar */}
      <aside className="glass" style={{ width: '280px', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--glass-border)' }}>
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Welcome, {user.username}</p>
        </div>

        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <button onClick={() => { setActiveTab('overview'); setMessage(''); }} className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Overview
          </button>
          <button onClick={() => { setActiveTab('new-comic'); setMessage(''); }} className={`sidebar-btn ${activeTab === 'new-comic' ? 'active' : ''}`}>
            <BookPlus size={20} /> New Comic
          </button>
          <button onClick={() => { setActiveTab('upload-chapter'); setMessage(''); }} className={`sidebar-btn ${activeTab === 'upload-chapter' ? 'active' : ''}`}>
            <UploadCloud size={20} /> Upload Chapter
          </button>
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" className="sidebar-btn" style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={20} /> Back to Site
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="sidebar-btn" style={{ color: '#ef4444' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        
        {message && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--accent-primary)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
            {message}
          </motion.div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '1rem', borderRadius: '1rem', color: '#a855f7' }}><FileText size={32} /></div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Comics</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{comics.length}</div>
                </div>
              </div>
              <div className="card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '1rem', color: '#3b82f6' }}><Users size={32} /></div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Registered Users</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>--</div>
                </div>
              </div>
              <div className="card glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '1rem', color: '#10b981' }}><DollarSign size={32} /></div>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Revenue</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>$0.00</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* NEW COMIC TAB */}
        {activeTab === 'new-comic' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create New Comic</h2>
            <div className="card glass" style={{ padding: '2rem', maxWidth: '800px' }}>
              <form onSubmit={handleComicSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="admin-input" />
                  </div>
                  <div>
                    <label className="form-label">Author</label>
                    <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="admin-input" />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="admin-input">
                      <option value="manhwa">Manhwa</option>
                      <option value="manga">Manga</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Genres (comma separated)</label>
                    <input type="text" value={genres} onChange={e => setGenres(e.target.value)} placeholder="Action, Fantasy, Romance" className="admin-input" />
                  </div>
                </div>

                <div>
                  <label className="form-label">Synopsis</label>
                  <textarea value={synopsis} onChange={e => setSynopsis(e.target.value)} required className="admin-input" style={{ minHeight: '120px' }} />
                </div>

                <div>
                  <label className="form-label">Cover Image</label>
                  <input type="file" onChange={e => setCover(e.target.files ? e.target.files[0] : null)} className="admin-input" style={{ padding: '0.5rem' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start', padding: '0.75rem 2rem' }}>Create Comic</button>
              </form>
            </div>
          </motion.div>
        )}

        {/* UPLOAD CHAPTER TAB */}
        {activeTab === 'upload-chapter' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Upload Chapter</h2>
            <div className="card glass" style={{ padding: '2rem', maxWidth: '800px' }}>
              <form onSubmit={handleChapterSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                
                <div>
                  <label className="form-label">Select Comic</label>
                  <select value={comicId} onChange={e => setComicId(e.target.value)} required className="admin-input">
                    <option value="" disabled>-- Choose a Comic --</option>
                    {comics.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">Chapter Number</label>
                    <input type="number" value={chapterNumber} onChange={e => setChapterNumber(e.target.value)} required className="admin-input" />
                  </div>
                  <div>
                    <label className="form-label">Chapter Title</label>
                    <input type="text" value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} placeholder="e.g. The Beginning" required className="admin-input" />
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: isPremium ? '1rem' : 0 }}>
                    <input type="checkbox" checked={isPremium} onChange={e => setIsPremium(e.target.checked)} id="premium" style={{ width: '1.25rem', height: '1.25rem' }} />
                    <label htmlFor="premium" style={{ fontWeight: 600, cursor: 'pointer' }}>Is Premium Chapter?</label>
                  </div>
                  {isPremium && (
                    <div>
                      <label className="form-label">Price (Coins)</label>
                      <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="admin-input" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="form-label">Chapter Pages / PDF File</label>
                  <input type="file" multiple accept="image/*,application/pdf" onChange={e => setPages(e.target.files)} className="admin-input" style={{ padding: '0.5rem' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start', padding: '0.75rem 2rem' }}>Upload Chapter</button>
              </form>
            </div>
          </motion.div>
        )}
      </main>

      <style>{`
        .sidebar-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 1rem;
          text-align: left;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .sidebar-btn:hover {
          background: rgba(255,255,255,0.1);
        }
        .sidebar-btn.active {
          background: var(--accent-primary);
          color: white;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .admin-input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--glass-border);
          color: white;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .admin-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

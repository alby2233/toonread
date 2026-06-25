import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChapterList from '../components/ChapterList';

import { AuthContext } from '../AuthContext';
import { api } from '../api';
import type { Comic, Chapter } from '../types';
import { ArrowLeft, Star, Share2, BookmarkPlus, BookOpen, Clock, Users, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ComicDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = React.useContext(AuthContext);
  const [comic, setComic] = useState<Comic | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chapters' | 'details' | 'comments'>('chapters');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const [comicData, chaptersData] = await Promise.all([
          api.getComic(id),
          api.getChapters(id)
        ]);
        if (comicData.coverUrl && comicData.coverUrl.startsWith('/uploads')) {
          comicData.coverUrl = `http://localhost:3000${comicData.coverUrl}`;
        }
        setComic(comicData);
        setChapters(chaptersData);
        
        if (user) {
          const bmRes = await api.checkBookmark(id);
          setIsBookmarked(bmRes.bookmarked);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleBookmark = async () => {
    if (!user) return alert('Please login to save to your library.');
    if (!id) return;
    setBookmarkLoading(true);
    try {
      const res = await api.toggleBookmark(id);
      setIsBookmarked(res.bookmarked);
    } catch (err) {
      console.error(err);
    } finally {
      setBookmarkLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto' }}
          />
        </div>
      </motion.div>
    );
  }

  if (!comic) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Comic not found</h2></div>;

  const sortedChapters = [...chapters].sort((a, b) => 
    sortOrder === 'desc' ? b.number - a.number : a.number - b.number
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Navbar />
      
      {/* Hero Header with heavy overlay to ensure readability */}
      <div style={{ position: 'relative', width: '100%', minHeight: '350px' }}>
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: 0, left: 0, width: '100%', height: '100%',
            backgroundImage: `url(${comic.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--bg-color) 10%, rgba(15,23,42,0.85) 60%, rgba(15,23,42,0.7) 100%)', backdropFilter: 'blur(10px)' }} />

        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '4rem', paddingBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', textDecoration: 'none' }}>
            <ArrowLeft size={20} /> Back to Library
          </Link>
          
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} style={{ flexShrink: 0 }}>
              <img 
                src={comic.coverUrl} 
                alt={comic.title} 
                style={{ width: '200px', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-lg)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)' }} 
              />
            </motion.div>

            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} style={{ flex: 1, paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}>
                  {comic.type}
                </span>
                <span style={{ background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Star size={14} fill="currentColor" /> {comic.rating}
                </span>
                <span style={{ background: 'rgba(0,0,0,0.6)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {comic.status}
                </span>
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 0.5rem 0', lineHeight: 1.1, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{comic.title}</h1>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={18} /> {comic.author}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {chapters.length > 0 && (
                  <Link to={`/comic/${comic.id}/chapter/${chapters[0].number}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}>
                    <BookOpen size={20} /> Read First Chapter
                  </Link>
                )}
                <button onClick={handleBookmark} disabled={bookmarkLoading} className={`btn ${isBookmarked ? 'btn-primary' : 'btn-glass'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookmarkPlus size={20} /> {isBookmarked ? 'In Library' : 'Add to Library'}
                </button>
                <button className="btn btn-glass" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Share2 size={20} /> Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <main className="container" style={{ padding: '2rem 1.5rem 4rem 1.5rem' }}>
        
        {/* Custom Tab Navigation */}
        <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
          {[
            { id: 'chapters', label: `Chapters (${chapters.length})`, icon: <Clock size={18} /> },
            { id: 'details', label: 'Details & Synopsis', icon: <BookOpen size={18} /> },
            { id: 'comments', label: 'Comments (12)', icon: <MessageSquare size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'transparent', border: 'none', padding: '1rem 0',
                color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '1.125rem', cursor: 'pointer', position: 'relative',
                transition: 'color 0.2s'
              }}
            >
              {tab.icon} {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: '3px', background: 'var(--accent-primary)', borderRadius: '3px 3px 0 0' }} />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          
          {/* CHAPTERS TAB */}
          {activeTab === 'chapters' && (
            <motion.div key="chapters" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button 
                  onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
                  className="btn btn-glass" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </button>
              </div>
              <div className="card glass" style={{ padding: '1.5rem', background: 'rgba(15,23,42,0.8)' }}>
                <ChapterList chapters={sortedChapters} comicId={comic.id} />
              </div>
            </motion.div>
          )}

          {/* DETAILS TAB */}
          {activeTab === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
              <div className="card glass" style={{ padding: '2rem', background: 'rgba(15,23,42,0.8)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Synopsis</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                  {comic.synopsis}
                </p>
              </div>
              <div className="card glass" style={{ padding: '2rem', background: 'rgba(15,23,42,0.8)', alignSelf: 'start' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block' }}>Genres</span>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {comic.genres.map((g, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem' }}>{g}</span>)}
                    </div>
                  </div>
                  <div><span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block' }}>Status</span><span style={{ fontWeight: 500 }}>{comic.status}</span></div>
                  <div><span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block' }}>Format</span><span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{comic.type}</span></div>
                </div>
              </div>
            </motion.div>
          )}

          {/* COMMENTS TAB (Mock) */}
          {activeTab === 'comments' && (
            <motion.div key="comments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="card glass" style={{ padding: '2rem', background: 'rgba(15,23,42,0.8)', textAlign: 'center' }}>
                <MessageSquare size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem auto', opacity: 0.5 }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Comments System</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                  Be the first to share your thoughts on this series! Connect with other readers and discuss the latest chapters.
                </p>
                <button className="btn btn-primary">Post a Comment</button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </motion.div>
  );
};

export default ComicDetails;

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChapterList from '../components/ChapterList';

import { AuthContext } from '../AuthContext';
import { api } from '../api';
import type { Comic, Chapter } from '../types';
import { ArrowLeft, Star, BookmarkPlus, BookOpen, Users } from 'lucide-react';
import Footer from '../components/Footer';

const ComicDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = React.useContext(AuthContext);
  const [comic, setComic] = useState<Comic | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
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
      <div>
        <Navbar />
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <div
            style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}
          />
        </div>
      </div>
    );
  }

  if (!comic) return <div style={{ textAlign: 'center', padding: '4rem' }}><h2>Comic not found</h2></div>;

  const sortedChapters = [...chapters].sort((a, b) => 
    sortOrder === 'desc' ? b.number - a.number : a.number - b.number
  );

  return (
    <div>
      <Navbar />
      
      {/* Background blurred cover */}
      <div style={{ 
        position: 'fixed', 
        top: 0, left: 0, width: '100vw', height: '100vh', 
        backgroundImage: `url(${comic.coverUrl})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        filter: 'blur(100px) brightness(0.2)',
        zIndex: -1,
        opacity: 0.6
      }} />

      <main className="container" style={{ padding: '3rem 1.5rem', minHeight: '100vh' }}>
        
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '2rem', textDecoration: 'none', transition: 'color 0.2s ease' }}>
          <ArrowLeft size={20} /> Back to Library
        </Link>

        {/* Split View Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: Sticky Sidebar */}
          <div style={{ 
            position: 'sticky', 
            top: '6rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(12px)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <img 
              src={comic.coverUrl} 
              alt={comic.title} 
              style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            />
            
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>{comic.title}</h1>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Users size={16} /> {comic.author}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                {comic.type}
              </span>
              <span style={{ background: 'rgba(0,0,0,0.4)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="currentColor" /> {comic.rating}
              </span>
              <span style={{ background: 'rgba(0,0,0,0.4)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {comic.status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {chapters.length > 0 && (
                <Link to={`/comic/${comic.id}/chapter/${chapters[0].number}`} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                  <BookOpen size={20} /> Read First Chapter
                </Link>
              )}
              <button onClick={handleBookmark} disabled={bookmarkLoading} className={`btn ${isBookmarked ? 'btn-primary' : 'btn-glass'}`} style={{ width: '100%', padding: '1rem' }}>
                <BookmarkPlus size={20} /> {isBookmarked ? 'In Library' : 'Add to Library'}
              </button>
            </div>
          </div>

          {/* Right Column: Scrollable Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Synopsis */}
            <div className="card" style={{ padding: '2rem', background: 'rgba(15,23,42,0.6)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Synopsis</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                {comic.synopsis}
              </p>
              
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Genres</h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {comic.genres.map((g, i) => <span key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.3rem 0.8rem', borderRadius: '2rem', fontSize: '0.85rem' }}>{g}</span>)}
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div className="card" style={{ padding: '2rem', background: 'rgba(15,23,42,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Chapters ({chapters.length})</h2>
                <button 
                  onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}
                  className="btn btn-glass" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                >
                  Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </button>
              </div>
              <ChapterList chapters={sortedChapters} comicId={comic.id} />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComicDetails;

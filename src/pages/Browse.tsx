import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import type { Comic } from '../types';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Search, Grid, List, Star } from 'lucide-react';

const Browse: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const data = await api.getComics();
        setComics(data);
      } catch (err) {
        console.error('Failed to load comics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, []);

  const filteredComics = comics.filter(comic => 
    comic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comic.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '100vh' }}>
      <Navbar />
      
      <main className="container" style={{ padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header & Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Browse <span className="text-gradient">Comics</span></h1>
              <p style={{ color: 'var(--text-secondary)' }}>Find your next favorite series.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Search series..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-input"
                  style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', width: '250px' }}
                />
              </div>
              
              <div className="glass" style={{ display: 'flex', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <button 
                  className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-glass'}`} 
                  onClick={() => setViewMode('grid')}
                  style={{ padding: '0.5rem', borderRadius: '0.25rem' }}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-glass'}`} 
                  onClick={() => setViewMode('list')}
                  style={{ padding: '0.5rem', borderRadius: '0.25rem' }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading comics...</div>
          ) : filteredComics.length === 0 ? (
            <div className="glass" style={{ textAlign: 'center', padding: '4rem', borderRadius: 'var(--radius-lg)' }}>
              No comics found matching your search.
            </div>
          ) : (
            <div 
              style={{ 
                display: viewMode === 'grid' ? 'grid' : 'flex', 
                flexDirection: 'column',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr', 
                gap: '1.5rem' 
              }}
            >
              {filteredComics.map((comic, index) => (
                <motion.div 
                  key={comic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/comic/${comic.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="card glass comic-card hover-glow" style={{ 
                      display: 'flex', 
                      flexDirection: viewMode === 'grid' ? 'column' : 'row',
                      padding: viewMode === 'grid' ? '0' : '1rem',
                      gap: viewMode === 'grid' ? '0' : '1.5rem',
                      height: '100%'
                    }}>
                      <div style={{ 
                        width: viewMode === 'grid' ? '100%' : '150px',
                        height: viewMode === 'grid' ? '280px' : '200px',
                        overflow: 'hidden',
                        borderRadius: viewMode === 'grid' ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-md)',
                        flexShrink: 0
                      }}>
                        <img 
                          src={comic.coverUrl.startsWith('/uploads') ? `http://localhost:3000${comic.coverUrl}` : comic.coverUrl} 
                          alt={comic.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: viewMode === 'grid' ? '1rem' : '0.5rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: viewMode === 'grid' ? '1.1rem' : '1.5rem', fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{comic.title}</h3>
                          {viewMode === 'list' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontSize: '0.9rem' }}>
                              <Star size={16} fill="#fbbf24" /> 4.8
                            </div>
                          )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>By {comic.author}</p>
                        
                        {viewMode === 'list' && (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {comic.synopsis}
                          </p>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: viewMode === 'grid' ? '0' : 'auto' }}>
                          <span style={{ 
                            background: 'rgba(255,255,255,0.1)', 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.25rem', 
                            fontSize: '0.75rem',
                            textTransform: 'uppercase'
                          }}>
                            {comic.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default Browse;

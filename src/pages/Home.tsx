import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ComicCard from '../components/ComicCard';

import { api } from '../api';
import type { Comic } from '../types';
import { Flame } from 'lucide-react';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const data = await api.getComics();
        setComics(data);
      } catch (err) {
        console.error("Failed to fetch comics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1.5rem', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        borderBottom: 'var(--panel-border)'
      }}>
        <h1 
          style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', maxWidth: '800px', lineHeight: 1.2, color: 'var(--text-primary)' }}
        >
          Discover the Ultimate <span style={{ color: 'var(--accent-primary)' }}>Comic Experience</span>
        </h1>
        <p 
          style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.6 }}
        >
          Read thousands of premium comics, support your favorite creators, and unlock exclusive chapters instantly.
        </p>
        <div
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button className="btn btn-primary" onClick={() => window.location.href='/browse'} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Start Reading
          </button>
          <button className="btn btn-outline" onClick={() => window.location.href='/store'} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Coins
          </button>
        </div>
      </section>

      <main className="container" style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
        <section>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}
          >
            <Flame size={28} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>Trending Now</h2>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div
                style={{ width: '40px', height: '40px', border: '4px solid var(--panel-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}
              />
            </div>
          ) : comics.length === 0 ? (
            <div className="manga-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              No comics available yet. Check back soon!
            </div>
          ) : (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {comics.map(comic => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          )}
        </section>


      </main>
      <Footer />
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ComicCard from '../components/ComicCard';

import { api } from '../api';
import type { Comic } from '../types';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 1.5rem', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        background: 'radial-gradient(circle at top, rgba(139, 92, 246, 0.15), transparent 50%)'
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', maxWidth: '800px', lineHeight: 1.2 }}
        >
          Discover the Ultimate <span className="text-gradient">Comic Experience</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', lineHeight: 1.6 }}
        >
          Read thousands of premium comics, support your favorite creators, and unlock exclusive chapters instantly.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button className="btn btn-primary" onClick={() => window.location.href='/browse'} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Start Reading
          </button>
          <button className="btn btn-outline" onClick={() => window.location.href='/store'} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Coins
          </button>
        </motion.div>
      </section>

      <main className="container" style={{ padding: '0 1.5rem 2rem 1.5rem' }}>
        <section>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}
          >
            <Flame size={28} style={{ color: 'var(--accent-primary)', filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8))' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Trending Now</h2>
          </motion.div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: '40px', height: '40px', border: '4px solid var(--glass-border)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto' }}
              />
            </div>
          ) : comics.length === 0 ? (
            <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              No comics available yet. Check back soon!
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {comics.map(comic => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </motion.div>
          )}
        </section>


      </main>
      <Footer />
    </motion.div>
  );
};

export default Home;

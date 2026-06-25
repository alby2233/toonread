import React from 'react';
import { Link } from 'react-router-dom';
import type { Comic } from '../types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComicCardProps {
  comic: Comic;
}

const ComicCard: React.FC<ComicCardProps> = ({ comic }) => {
  // Use framer-motion for smooth entrance and 3D hover scale
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, translateY: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/comic/${comic.id}`} style={{ display: 'block' }}>
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ position: 'relative', paddingTop: '140%', overflow: 'hidden', background: '#000' }}>
            <img 
              src={comic.coverUrl && comic.coverUrl.startsWith('/uploads') ? `http://localhost:3000${comic.coverUrl}` : comic.coverUrl} 
              alt={comic.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              padding: '0.25rem 0.5rem',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              <Star size={12} fill="#fbbf24" color="#fbbf24" />
              {comic.rating}
            </div>
            <div style={{
              position: 'absolute',
              bottom: '0.5rem',
              left: '0.5rem',
              background: 'var(--accent-primary)',
              padding: '0.15rem 0.4rem',
              borderRadius: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              {comic.type}
            </div>
          </div>
          <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {comic.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {comic.author}
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {comic.status}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ComicCard;

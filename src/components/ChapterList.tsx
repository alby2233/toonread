import React from 'react';
import { Link } from 'react-router-dom';
import type { Chapter } from '../types';
import { Clock, Lock, PlayCircle } from 'lucide-react';

interface ChapterListProps {
  chapters: Chapter[];
  comicId: string;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, comicId }) => {
  if (chapters.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
        No chapters available yet.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {chapters.map((chapter) => (
        <Link 
          key={chapter.id} 
          to={`/comic/${comicId}/chapter/${chapter.number}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem',
            background: 'rgba(15, 23, 42, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-md)',
            transition: 'all 0.3s ease',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateX(5px)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(15, 23, 42, 0.4)';
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)' }}>
              <PlayCircle size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '1.05rem' }}>
                Chapter {chapter.number}
                {(chapter as any).isPremium ? <Lock size={14} style={{ color: '#fbbf24' }} /> : null}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{chapter.title || 'Read now'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <Clock size={14} />
            {chapter.date}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChapterList;

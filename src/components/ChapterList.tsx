import React from 'react';
import { Link } from 'react-router-dom';
import type { Chapter } from '../types';
import { Clock, Lock } from 'lucide-react';

interface ChapterListProps {
  chapters: Chapter[];
  comicId: string;
}

const ChapterList: React.FC<ChapterListProps> = ({ chapters, comicId }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {chapters.map((chapter) => (
        <Link 
          key={chapter.id} 
          to={`/comic/${comicId}/chapter/${chapter.number}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Chapter {chapter.number}
              {(chapter as any).isPremium ? <Lock size={14} style={{ color: '#fbbf24' }} /> : null}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{chapter.title}</span>
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

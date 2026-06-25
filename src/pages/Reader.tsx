import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Comic, Chapter } from '../types';
import { AuthContext } from '../AuthContext';

import { ArrowLeft, ChevronLeft, ChevronRight, LayoutList, BookOpen, Lock, Unlock } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Reader: React.FC = () => {
  const { id, chapterNumber } = useParams<{ id: string; chapterNumber: string }>();
  const navigate = useNavigate();
  const { user, updateCoins } = useContext(AuthContext);
  
  const [comic, setComic] = useState<Comic | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [readingMode, setReadingMode] = useState<'vertical' | 'paged'>('vertical');
  const [currentPage, setCurrentPage] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // PDF State
  const [numPdfPages, setNumPdfPages] = useState<number>(0);

  // Toggle controls on click
  const handleOverlayClick = () => {
    setShowControls(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id || !chapterNumber) return;
        const comicData = await api.getComic(id);
        setComic(comicData);
        setReadingMode(comicData.type === 'manga' ? 'paged' : 'vertical');

        const chapterData = await api.getChapterPages(id, chapterNumber);
        
        // Format image URLs if local
        if (chapterData.pages) {
          chapterData.pages = chapterData.pages.map((p: string) => 
            p.startsWith('/uploads') ? `http://localhost:3000${p}` : p
          );
        }
        
        setChapter(chapterData);
        setCurrentPage(0);
      } catch (err: any) {
        try {
          const parsedError = JSON.parse(err.message);
          setError(parsedError);
        } catch {
          setError({ error: 'Failed to load chapter' });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, chapterNumber, user]); // Refetch if user changes (e.g. login)

  const handleUnlock = async () => {
    if (!error?.chapterId) return;
    try {
      const res = await api.unlockChapter(error.chapterId);
      if (res.success) {
        updateCoins(res.remainingCoins);
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to unlock chapter');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPdfPages(numPages);
  };

  if (loading) {
    return <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#000', color: 'white', minHeight: '100vh' }}>Loading...</div>;
  }

  if (error && error.error === 'Premium chapter locked') {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#000', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Lock size={64} style={{ color: '#fbbf24', marginBottom: '2rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Premium Chapter</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This chapter requires {error.price} coins to unlock.</p>
        
        {user ? (
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', alignItems: 'center' }}>
            <div>Your balance: <strong>{user.coins} coins</strong></div>
            {user.coins >= error.price ? (
              <button onClick={handleUnlock} className="btn btn-primary"><Unlock size={20} /> Unlock Chapter</button>
            ) : (
              <Link to="/store" className="btn btn-primary">Get More Coins</Link>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">Login to Unlock</Link>
        )}
        <button onClick={() => navigate(`/comic/${id}`)} className="btn btn-glass" style={{ marginTop: '2rem' }}>Go Back</button>
      </div>
    );
  }

  if (!comic || !chapter) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#000', color: 'white', minHeight: '100vh' }}>
        <h2>Chapter not found</h2>
        <button onClick={() => navigate(-1)} className="btn btn-glass" style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  const isPdf = chapter.pages?.[0]?.toLowerCase().endsWith('.pdf');
  const totalPages = isPdf ? numPdfPages : (chapter.pages?.length || 0);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      const num = parseInt(chapterNumber || '1', 10);
      navigate(`/comic/${id}/chapter/${num + 1}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else {
      const num = parseInt(chapterNumber || '1', 10);
      if (num > 1) navigate(`/comic/${id}/chapter/${num - 1}`);
    }
  };

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: 'white' }}>
      {/* Top Navbar (Overlay) */}
      <div 
        className="glass animate-fade-in"
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', 
          padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 50, transition: 'transform 0.3s',
          transform: showControls ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <Link to={`/comic/${id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={20} /> <span style={{ fontWeight: 600 }}>{comic.title}</span> - Ch. {chapter.number}
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn ${readingMode === 'vertical' ? 'btn-primary' : 'btn-glass'}`} 
            onClick={() => setReadingMode('vertical')}
            title="Vertical Scroll"
            style={{ padding: '0.5rem' }}
          >
            <LayoutList size={20} />
          </button>
          <button 
             className={`btn ${readingMode === 'paged' ? 'btn-primary' : 'btn-glass'}`} 
             onClick={() => setReadingMode('paged')}
             title="Paged Reading"
             style={{ padding: '0.5rem' }}
          >
            <BookOpen size={20} />
          </button>
        </div>
      </div>

      {/* Reader Content */}
      <div 
        onClick={handleOverlayClick}
        style={{ 
          paddingTop: showControls ? '4rem' : '0', 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          transition: 'padding-top 0.3s',
          cursor: readingMode === 'paged' ? 'auto' : 'pointer',
          overflowX: 'hidden'
        }}
      >
        {readingMode === 'vertical' ? (
          <div style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isPdf ? (
              <Document file={chapter.pages?.[0]} onLoadSuccess={onDocumentLoadSuccess} loading={<div style={{padding: '2rem'}}>Loading PDF...</div>}>
                {Array.from(new Array(numPdfPages), (_el, index) => (
                  <div key={`page_${index + 1}`} style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                    <Page pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} width={800} />
                  </div>
                ))}
              </Document>
            ) : (
              chapter.pages?.map((pageUrl: string, index: number) => (
                <img 
                  key={index} 
                  src={pageUrl} 
                  alt={`Page ${index + 1}`} 
                  style={{ width: '100%', display: 'block' }} 
                />
              ))
            )}
            
            <div style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={(e) => { e.stopPropagation(); handleNextPage(); }}
                >
                  Next Chapter <ChevronRight size={20} />
                </button>
            </div>
          </div>
        ) : (
          <div style={{ 
            maxWidth: '1000px', width: '100%', flex: 1, 
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            position: 'relative'
          }}>
            {isPdf ? (
              <Document file={chapter.pages?.[0]} onLoadSuccess={onDocumentLoadSuccess} loading={<div style={{padding: '2rem'}}>Loading PDF...</div>}>
                {numPdfPages > 0 && (
                  <Page pageNumber={currentPage + 1} renderTextLayer={false} renderAnnotationLayer={false} height={800} />
                )}
              </Document>
            ) : (
              <img 
                src={chapter.pages?.[currentPage]} 
                alt={`Page ${currentPage + 1}`} 
                style={{ maxHeight: '90vh', maxWidth: '100%', objectFit: 'contain' }} 
              />
            )}
            
            <div 
              style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: '100%', cursor: 'pointer', zIndex: 10 }}
              onClick={(e) => { e.stopPropagation(); handlePrevPage(); }}
            />
            <div 
              style={{ position: 'absolute', top: 0, right: 0, width: '30%', height: '100%', cursor: 'pointer', zIndex: 10 }}
              onClick={(e) => { e.stopPropagation(); handleNextPage(); }}
            />
          </div>
        )}
      </div>

      {/* Bottom Controls (Overlay) for Paged Mode */}
      {readingMode === 'paged' && (
        <div 
          className="glass animate-fade-in"
          style={{
            position: 'fixed', bottom: 0, left: 0, width: '100%', 
            padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            zIndex: 50, transition: 'transform 0.3s',
            transform: showControls ? 'translateY(0)' : 'translateY(100%)'
          }}
        >
          <button className="btn btn-glass" onClick={handlePrevPage}>
            <ChevronLeft size={20} /> Prev
          </button>
          <span>{currentPage + 1} / {totalPages}</span>
          <button className="btn btn-glass" onClick={handleNextPage}>
            Next <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* React-PDF Global Styles Overrides */}
      <style>{`
        .react-pdf__Page__canvas {
          margin: 0 auto;
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
};

export default Reader;

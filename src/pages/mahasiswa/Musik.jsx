import { useState, useRef, useEffect } from 'react';
import foto1 from '../../assets/fotomusik1.png';
import foto2 from '../../assets/fotomusik2.png';
import foto3 from '../../assets/fotomusik3.png';
import foto4 from '../../assets/fotomusik4.png';
import foto5 from '../../assets/fotomusik5.png';
import foto6 from '../../assets/fotomusik6.png';
import foto7 from '../../assets/fotomusik7.png';
import foto8 from '../../assets/fotomusik8.png';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const CATEGORIES = ['Relaksasi', 'Fokus Belajar', 'Tidur Sehat'];

const SONGS = [
  // ── RELAKSASI (foto 1, 2, 3, 4, 5) ──
  {
    id: 1,
    category: 'Relaksasi',
    title: 'Stress Meditation Music',
    titleHighlight: 'Stress',
    channel: 'Relaxing Soul',
    source: 'YouTube',
    youtubeId: 'inpok4MKVLM',
    thumbnail: foto1,
  },
  {
    id: 2,
    category: 'Relaksasi',
    title: 'Calm & Rain Piano',
    titleHighlight: 'Calm &',
    channel: 'Relaxing Ghibli',
    source: 'YouTube',
    youtubeId: 'rUxyKA_-grg',
    thumbnail: foto2,
  },
  {
    id: 3,
    category: 'Relaksasi',
    title: 'Quiet Storm',
    titleHighlight: 'Quiet',
    channel: 'Lofi Girl Relax',
    source: 'YouTube',
    youtubeId: '4xDzrJKXOOY',
    thumbnail: foto3,
  },
  {
    id: 4,
    category: 'Relaksasi',
    title: 'Ocean Breeze',
    titleHighlight: 'Ocean',
    channel: 'Mindful Audio',
    source: 'YouTube',
    youtubeId: 'WHPEKLQID4U',
    thumbnail: foto4,
  },
  {
    id: 5,
    category: 'Relaksasi',
    title: 'Gentle Forest',
    titleHighlight: 'Gentle',
    channel: 'Nature Sounds',
    source: 'YouTube',
    youtubeId: 'eKFTSSKCzWA',
    thumbnail: foto5,
  },

  // ── FOKUS BELAJAR (foto 6, 7, 8, 1, 2) ──
  {
    id: 6,
    category: 'Fokus Belajar',
    title: 'Breath Easy',
    titleHighlight: 'Breath',
    channel: 'Chillhop Music',
    source: 'YouTube',
    youtubeId: 'HluANRwPyNo',
    thumbnail: foto6,
  },
  {
    id: 7,
    category: 'Fokus Belajar',
    title: 'Deep Focus Flow',
    titleHighlight: 'Deep',
    channel: 'Lofi Chill',
    source: 'YouTube',
    youtubeId: '5qap5aO4i9A',
    thumbnail: foto7,
  },
  {
    id: 8,
    category: 'Fokus Belajar',
    title: 'Study with Me',
    titleHighlight: 'Study',
    channel: 'Chillhop Music',
    source: 'YouTube',
    youtubeId: 'lTRiuFIWV54',
    thumbnail: foto8,
  },
  {
    id: 9,
    category: 'Fokus Belajar',
    title: 'Rainy Cafe Lofi',
    titleHighlight: 'Rainy',
    channel: 'Lofi Girl',
    source: 'YouTube',
    youtubeId: 'jfKfPfyJRdk',
    thumbnail: foto1,
  },
  {
    id: 10,
    category: 'Fokus Belajar',
    title: 'Midnight Study',
    titleHighlight: 'Midnight',
    channel: 'Chill Nation',
    source: 'YouTube',
    youtubeId: 'DWcJFNfaw9c',
    thumbnail: foto2,
  },

  // ── TIDUR SEHAT (foto 3, 4, 5, 6, 7) ──
  {
    id: 11,
    category: 'Tidur Sehat',
    title: 'Still Waters',
    titleHighlight: 'Still',
    channel: 'Mindful Audio',
    source: 'YouTube',
    youtubeId: 'lFcSrYw-ARY',
    thumbnail: foto3,
  },
  {
    id: 12,
    category: 'Tidur Sehat',
    title: 'Rain on Rooftops',
    titleHighlight: 'Rain on',
    channel: 'Mindful Audio',
    source: 'YouTube',
    youtubeId: 'mPZkdNFkNps',
    thumbnail: foto4,
  },
  {
    id: 13,
    category: 'Tidur Sehat',
    title: 'Sleeping Lullaby',
    titleHighlight: 'Sleeping',
    channel: 'Relaxing Soul',
    source: 'YouTube',
    youtubeId: 'z5eruG5Qlwc',
    thumbnail: foto5,
  },
  {
    id: 14,
    category: 'Tidur Sehat',
    title: 'Night Wind',
    titleHighlight: 'Night',
    channel: 'Nature Sounds',
    source: 'YouTube',
    youtubeId: 'RqzGzwTY-6w',
    thumbnail: foto6,
  },
  {
    id: 15,
    category: 'Tidur Sehat',
    title: 'Deep Sleep Waves',
    titleHighlight: 'Deep',
    channel: 'Sleep Sounds',
    source: 'YouTube',
    youtubeId: 'rkZl7pt9gnY',
    thumbnail: foto7,
  },
];

// ─────────────────────────────────────────────
// WAVEFORM SVG
// ─────────────────────────────────────────────
const WaveformIcon = () => (
  <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
    {[2, 6, 10, 14, 18, 22, 26, 30, 34].map((x, i) => {
      const heights = [6, 14, 10, 18, 8, 16, 12, 10, 6];
      const h = heights[i];
      const y = (20 - h) / 2;
      return (
        <rect key={x} x={x - 1} y={y} width="2" height={h} rx="1" fill="#94a3b8" />
      );
    })}
  </svg>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Musik = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('Relaksasi');
  const [playingSong, setPlayingSong] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(222);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressInterval = useRef(null);

  const filteredSongs = SONGS.filter(s => s.category === activeCategory);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0.00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}.${s.toString().padStart(2, '0')}`;
  };

  const handlePlay = (song) => {
    if (playingSong?.id === song.id) {
      setIsPlaying(prev => !prev);
    } else {
      setPlayingSong(song);
      setProgress(0);
      setCurrentTime(0);
      setDuration(222);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (!playingSong) return;
    const idx = SONGS.findIndex(s => s.id === playingSong.id);
    if (idx > 0) {
      setPlayingSong(SONGS[idx - 1]);
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (!playingSong) return;
    const idx = SONGS.findIndex(s => s.id === playingSong.id);
    if (idx < SONGS.length - 1) {
      setPlayingSong(SONGS[idx + 1]);
      setProgress(0);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying && playingSong) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 222) {
            clearInterval(progressInterval.current);
            setIsPlaying(false);
            return 222;
          }
          const next = prev + 1;
          setProgress((next / 222) * 100);
          return next;
        });
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying, playingSong]);

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newTime = ratio * 222;
    setCurrentTime(newTime);
    setProgress(ratio * 100);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .msk-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .msk-root::-webkit-scrollbar { display: none; }
        .msk-root { -ms-overflow-style: none; scrollbar-width: none; }
        .msk-root {
          position: relative;
          height: 100%;
          width: 100%;
          background: #ffffff;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .msk-cat-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          flex-wrap: nowrap;
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding-bottom: 2px;
        }
        .msk-cat-scroll::-webkit-scrollbar { display: none; }
        .msk-cat-btn {
          padding: 8px 20px;
          border-radius: 999px;
          border: 1.5px solid #cbd5e1;
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.18s ease;
          font-family: 'Poppins', sans-serif;
          color: #64748b;
        }
        .msk-cat-btn.active {
          background: #fff;
          border-color: #088395;
          color: #088395;
          box-shadow: 0 2px 8px rgba(8,131,149,0.18);
        }
        .msk-cat-btn:hover:not(.active) {
          background: #e6f4f4;
          border-color: #7AB2B2;
          color: #09637E;
        }
        .msk-song-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #f1f5f9;
          border-radius: 16px;
          padding: 12px 14px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          margin-bottom: 12px;
          border: 1.5px solid transparent;
        }
        .msk-song-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(8,131,149,0.10);
          border-color: #b2dce0;
        }
        .msk-song-card:active { transform: scale(0.98); }
        .msk-song-card.playing-card {
          background: #fff;
          border: 1.5px solid #088395;
          box-shadow: 0 4px 18px rgba(8,131,149,0.15);
          flex-direction: column;
          align-items: stretch;
          padding: 14px 16px 18px;
          border-radius: 18px;
        }
        .msk-play-btn-large {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #088395 0%, #09637E 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(8,131,149,0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          font-family: 'Poppins', sans-serif;
        }
        .msk-play-btn-large:hover { transform: scale(1.07); box-shadow: 0 6px 20px rgba(8,131,149,0.45); }
        .msk-play-btn-large:active { transform: scale(0.95); }
        .msk-ctrl-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #088395;
          display: flex;
          align-items: center;
          padding: 6px;
          border-radius: 50%;
          transition: background 0.15s;
          font-family: 'Poppins', sans-serif;
        }
        .msk-ctrl-btn:hover { background: rgba(8,131,149,0.08); }
        .msk-progress-bar {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 999px;
          cursor: pointer;
          margin: 10px 0 4px;
          position: relative;
        }
        .msk-progress-bar:hover .msk-progress-thumb {
          transform: translateY(-50%) scale(1.2);
        }
        .msk-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #088395, #09637E);
          transition: width 0.5s linear;
          position: relative;
        }
        .msk-progress-thumb {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #088395;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(8,131,149,0.2);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          cursor: grab;
        }
        .msk-progress-thumb:active { cursor: grabbing; box-shadow: 0 0 0 5px rgba(8,131,149,0.25); }

        @keyframes msk-card-open {
          from { opacity: 0; transform: translateY(6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msk-card-open {
          animation: msk-card-open 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .msk-thumbnail {
          width: 58px;
          height: 58px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }
        .msk-diputar-badge {
          display: inline-block;
          background: linear-gradient(135deg, #088395 0%, #09637E 100%);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 999px;
          margin-top: 4px;
          letter-spacing: 0.3px;
        }
        .msk-back-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #088395;
          font-size: 14px;
          font-weight: 500;
          font-family: 'Poppins', sans-serif;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0;
        }
        .msk-back-btn:hover { color: #09637E; }
        .msk-play-icon-sm {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        @keyframes msk-fadein {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msk-fadein { animation: msk-fadein 0.28s ease both; }
      `}</style>

      <div className="msk-root">
        <div style={{ padding: '52px 20px 32px' }}>

          {/* ════ BACK ════ */}
          <button className="msk-back-btn" onClick={onBack} style={{ marginBottom: 24 }}>
            ‹ Kembali ke Beranda
          </button>

          {/* ════ HEADER ════ */}
          <h1 style={{ margin: '0 0 6px', fontSize: 32, fontWeight: 800, color: '#088395', letterSpacing: -0.5, lineHeight: 1.1 }}>
            Musik
          </h1>
          <p style={{ margin: '0 0 24px', fontSize: 14, color: '#64748b', fontWeight: 400, lineHeight: 1.6 }}>
            Dengarkan musik sesuai dengan suasana hatimu.
          </p>

          {/* ════ CATEGORY TABS ════ */}
          <div className="msk-cat-scroll" style={{ marginBottom: 28 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`msk-cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ════ SONG LIST ════ */}
          <div>
            {filteredSongs.map((song, i) => {
              const isThisPlaying = playingSong?.id === song.id;

              if (isThisPlaying) {
                return (
                  <div key={song.id} className="msk-song-card playing-card msk-card-open">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <img src={song.thumbnail} alt={song.title} className="msk-thumbnail" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#088395', lineHeight: 1.3 }}>
                          {song.title}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#64748b' }}>
                          {song.channel} &bull; {song.source}
                        </p>
                        <span className="msk-diputar-badge">Diputar</span>
                      </div>
                    </div>

                    <div className="msk-progress-bar" onClick={handleProgressClick}>
                      <div className="msk-progress-fill" style={{ width: `${progress}%` }}>
                        <div className="msk-progress-thumb" />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 10 }}>
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
                      <button className="msk-ctrl-btn" onClick={handlePrev}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M19 20L9 12l10-8v16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </button>

                      <button className="msk-play-btn-large" onClick={() => setIsPlaying(p => !p)}>
                        {isPlaying ? (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="6" y="4" width="4" height="16" rx="1" fill="#fff"/>
                            <rect x="14" y="4" width="4" height="16" rx="1" fill="#fff"/>
                          </svg>
                        ) : (
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M5 3l14 9-14 9V3z" fill="#fff"/>
                          </svg>
                        )}
                      </button>

                      <button className="msk-ctrl-btn" onClick={handleNext}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M5 4l10 8-10 8V4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={song.id}
                  className="msk-song-card msk-fadein"
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => handlePlay(song)}
                >
                  <img src={song.thumbnail} alt={song.title} className="msk-thumbnail" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: '#088395', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {song.title}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
                      {song.channel} &bull; {song.source}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <WaveformIcon />
                    <button className="msk-play-icon-sm" onClick={(e) => { e.stopPropagation(); handlePlay(song); }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 3l14 9-14 9V3z" fill="#088395"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
};

export default Musik;

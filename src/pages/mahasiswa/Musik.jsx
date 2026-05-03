import { useState, useEffect, useRef } from 'react';
import { getAllMusik } from '../../services/musikApi';
import './Musik.css';

const WaveformIcon = ({ className = '' }) => (
  <svg width="36" height="20" viewBox="0 0 36 20" fill="none" aria-hidden className={className}>
    {[2, 6, 10, 14, 18, 22, 26, 30, 34].map((x, i) => {
      const heights = [6, 14, 10, 18, 8, 16, 12, 10, 6];
      const h = heights[i];
      const y = (20 - h) / 2;
      return <rect key={x} x={x - 1} y={y} width="2" height={h} rx="1" fill="#94a3b8" />;
    })}
  </svg>
);

const getThumbnailUrl = (song) => {
  if (song?.thumbnail_url) return song.thumbnail_url;
  if (song?.youtube_id) return `https://img.youtube.com/vi/${song.youtube_id}/hqdefault.jpg`;
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" rx="24" fill="%23dbe7ed"/><path d="M120 65h34l33 23-33 23h-34z" fill="%230f7491" opacity="0.85"/><text x="160" y="146" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="%236b7f8c">Musik</text></svg>';
};

const getYouTubeEmbedUrl = (youtubeId, autoplay = false) => {
  if (!youtubeId) return '';
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    loop: '1',
    playlist: youtubeId,
  });
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
};

const Musik = ({ onBack }) => {
  const preferredCategoryOrder = ['Relaksasi', 'Fokus Belajar', 'Tidur Sehat'];
  const [songs, setSongs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [playingSong, setPlayingSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(222);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const apiPromiseRef = useRef(null);

  useEffect(() => {
    const fetchMusik = async () => {
      try {
        setLoading(true);
        const res = await getAllMusik();
        if (res && res.success && Array.isArray(res.data)) {
          setSongs(res.data);
          const uniq = [...new Set(res.data.map(s => s.category || 'Umum'))].sort((a, b) => {
            const aIndex = preferredCategoryOrder.indexOf(a);
            const bIndex = preferredCategoryOrder.indexOf(b);
            if (aIndex !== -1 || bIndex !== -1) {
              return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
            }
            return a.localeCompare(b, 'id');
          });
          setCategories(uniq);
          if (uniq.length > 0) setActiveCategory(uniq[0]);
        } else {
          setSongs([]);
          setCategories([]);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Gagal memuat musik');
      } finally {
        setLoading(false);
      }
    };
    fetchMusik();
  }, []);

  const filteredSongs = activeCategory ? songs.filter(s => s.category === activeCategory) : songs;
  const featuredSong = playingSong && filteredSongs.some(song => song.id_musik === playingSong.id_musik)
    ? playingSong
    : filteredSongs[0] || null;
  const otherSongs = featuredSong
    ? filteredSongs.filter(song => song.id_musik !== featuredSong.id_musik)
    : filteredSongs;

  useEffect(() => {
    if (filteredSongs.length === 0) {
      return;
    }

    const activeSongExists = playingSong && filteredSongs.some(song => song.id_musik === playingSong.id_musik);
    if (!activeSongExists) {
      setPlayingSong(filteredSongs[0]);
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
      setDuration(222);
    }
  }, [activeCategory, filteredSongs, playingSong]);

  const handlePlay = (song) => {
    if (!song) return;
    if (playingSong && playingSong.id_musik === song.id_musik) {
      setIsPlaying(p => !p);
    } else {
      setPlayingSong(song);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(222);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (!playingSong) return;
    const idx = filteredSongs.findIndex(s => s.id_musik === playingSong.id_musik);
    if (idx > 0) handlePlay(filteredSongs[idx - 1]);
  };

  const handleNext = () => {
    if (!playingSong) return;
    const idx = filteredSongs.findIndex(s => s.id_musik === playingSong.id_musik);
    if (idx >= 0 && idx < filteredSongs.length - 1) handlePlay(filteredSongs[idx + 1]);
  };

  useEffect(() => {
    if (!playingSong?.youtube_id) {
      return undefined;
    }

    const syncPlayer = async () => {
      if (!window.YT || !window.YT.Player) {
        if (!apiPromiseRef.current) {
          apiPromiseRef.current = new Promise((resolve) => {
            const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
            if (existingScript) {
              window.onYouTubeIframeAPIReady = resolve;
              return;
            }

            window.onYouTubeIframeAPIReady = resolve;
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            document.body.appendChild(script);
          });
        }

        await apiPromiseRef.current;
      }

      if (!playerRef.current && playerHostRef.current) {
        playerRef.current = new window.YT.Player(playerHostRef.current, {
          videoId: playingSong.youtube_id,
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            loop: 1,
            playlist: playingSong.youtube_id,
          },
          events: {
            onReady: (event) => {
              const durationValue = event.target.getDuration?.() || 222;
              if (durationValue > 0) {
                setDuration(durationValue);
              }
              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setDuration(event.target.getDuration() || 222);
              }
              if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.seekTo(0, true);
                event.target.playVideo();
              }
            },
          },
        });
        return;
      }

      if (playerRef.current) {
        const currentVideo = playerRef.current.getVideoData?.().video_id;
        if (currentVideo !== playingSong.youtube_id) {
          playerRef.current.loadVideoById({
            videoId: playingSong.youtube_id,
            startSeconds: 0,
          });
          setCurrentTime(0);
          setProgress(0);
        }

        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      }
    };

    syncPlayer().catch((err) => {
      console.error('YouTube player error:', err);
      setError('Pemutar musik gagal dimuat');
    });
  }, [playingSong, isPlaying]);

  useEffect(() => {
    if (!playerRef.current) return undefined;

    if (isPlaying && playingSong) {
      timerRef.current = setInterval(() => {
        const player = playerRef.current;
        if (!player?.getCurrentTime || !player?.getDuration) return;

        const nextCurrentTime = player.getCurrentTime();
        const nextDuration = player.getDuration() || duration;
        setCurrentTime(nextCurrentTime);
        setDuration(nextDuration);
        setProgress(nextDuration > 0 ? (nextCurrentTime / nextDuration) * 100 : 0);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, playingSong, duration]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const t = Math.max(0, Math.min(1, ratio)) * duration;
    setCurrentTime(t);
    setProgress((t / duration) * 100);
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(t, true);
    }
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="musik-page">
      <div className="musik-shell">
        <button className="musik-back" onClick={onBack}>‹ Kembali ke Beranda</button>

        <div>
          <h1 className="musik-title">Musik</h1>
          <p className="musik-subtitle">
            Dengarkan musik sesuai dengan suasana hatimu.
          </p>
        </div>

        {!loading && categories.length > 0 && (
          <div className="musik-categories">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`musik-category ${activeCategory === cat ? 'musik-category--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && <p className="musik-message">Memuat musik...</p>}
        {error && <p className="musik-message musik-message--error">{error}</p>}

        {!loading && featuredSong && (
          <section className="musik-featured">
            <div ref={playerHostRef} className="musik-youtube-host" aria-hidden />
            <div className="musik-featured__top">
              <img
                src={getThumbnailUrl(featuredSong)}
                alt={featuredSong.title}
                className="musik-featured__thumb"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.src = getThumbnailUrl({});
                }}
              />
              <div className="musik-featured__body">
                <div className="musik-featured__head">
                  <div style={{ minWidth: 0 }}>
                    <p className="musik-featured__title">{featuredSong.title}</p>
                    <p className="musik-featured__meta">
                      {featuredSong.channel || 'YouTube'} • YouTube
                    </p>
                  </div>
                  <span className="musik-badge">Diputar</span>
                </div>

                <div className="musik-featured__tagline">
                  <WaveformIcon className="musik-waveform" />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{featuredSong.category}</span>
                </div>
              </div>
            </div>

            <div className="musik-featured__controls">
              <div className="musik-progress" onClick={handleSeek}>
                <div className="musik-progress__fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="musik-timer">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <div className="musik-player">
                <button
                  type="button"
                  className="musik-player__button musik-player__button--small"
                  onClick={handlePrev}
                  aria-label="Sebelumnya"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M19 20L9 12l10-8v16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="musik-player__button musik-player__button--main"
                  onClick={() => handlePlay(featuredSong)}
                  aria-label="Putar atau jeda"
                >
                  {isPlaying ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <rect x="6" y="4" width="4" height="16" rx="1" fill="white" />
                      <rect x="14" y="4" width="4" height="16" rx="1" fill="white" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M5 3l14 9-14 9V3z" fill="white" />
                    </svg>
                  )}
                </button>

                <button
                  type="button"
                  className="musik-player__button musik-player__button--small"
                  onClick={handleNext}
                  aria-label="Selanjutnya"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 4l10 8-10 8V4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        )}

        {!loading && otherSongs.length > 0 && (
          <div className="musik-list">
            {otherSongs.map((song, idx) => (
              <button
                key={song.id_musik}
                type="button"
                onClick={() => handlePlay(song)}
                className="musik-track"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <img
                  src={getThumbnailUrl(song)}
                  alt={song.title}
                  className="musik-track__thumb"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.src = getThumbnailUrl({});
                  }}
                />
                <div className="musik-track__body">
                  <p className="musik-track__title">{song.title}</p>
                  <p className="musik-track__meta">
                    {song.channel || 'YouTube'} • YouTube
                  </p>
                </div>
                <div className="musik-track__side">
                  <WaveformIcon />
                  <svg className="musik-track__play" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && filteredSongs.length === 0 && (
          <p className="musik-message">Belum ada musik pada kategori ini.</p>
        )}
      </div>
    </div>
  );
};

export default Musik;

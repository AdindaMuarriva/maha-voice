import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dashboardBg from '../../assets/dashboardbg.png';
import headRobot from '../../assets/head.png';
import screeningRobot from '../../assets/robot_onboarding2.png';
import profileIcon from '../../assets/profile.png';
import { getAllTips } from '../../services/tipsApi';
import { getLatestUserScreening } from '../../services/adminApi';

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
// keep icons separately to reuse when building translated FEATURES
const ICONS = {
  chat: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="12" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
    </svg>
  ),
  screening: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M16 16l2 2 3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  history: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.05 11a9 9 0 1 0 .5-4M3 7v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  music: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  )
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Dashboard = ({ userName = 'Adinda Muarriva', currentUser, onFeatureClick, onProfileClick, onTipSelect }) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [latestScreening, setLatestScreening] = useState(null);
  const { t } = useTranslation();

  const FEATURES = [
    { id: 'chat', icon: ICONS.chat, filled: true, label: t('dashboard.features.chat.label'), desc: t('dashboard.features.chat.desc') },
    { id: 'screening', icon: ICONS.screening, filled: false, label: t('dashboard.features.screening.label') || t('dashboard.features.screening.label'), desc: t('dashboard.features.screening.desc') },
    { id: 'history', icon: ICONS.history, filled: false, label: t('dashboard.features.history.label'), desc: t('dashboard.features.history.desc') },
    { id: 'music', icon: ICONS.music, filled: true, label: t('dashboard.features.music.label'), desc: t('dashboard.features.music.desc') },
  ];

  const CATEGORIES = t('dashboard.categories', { returnObjects: true }) || ['Semua', 'Fokus Belajar', 'Tidur Sehat', 'Relaksasi'];

  // Helper: Map score to stress level
  const getStressLevel = (score) => {
    if (score <= 10) return 'Minimal';
    if (score <= 20) return 'Ringan';
    if (score <= 30) return 'Sedang';
    return 'Berat';
  };

  // Helper: Calculate days ago
  const getDaysAgo = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const days = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (days === 0) return 'Hari ini';
      if (days === 1) return '1 hari yang lalu';
      return `${days} hari yang lalu`;
    } catch {
      return '';
    }
  };

  // Fetch latest screening
  useEffect(() => {
    const fetchLatestScreening = async () => {
      if (!currentUser?.id_user && !currentUser?.id) return;
      try {
        const userId = currentUser?.id_user || currentUser?.id;
        const result = await getLatestUserScreening(userId);
        setLatestScreening(result);
      } catch (error) {
        console.error('Error fetching latest screening:', error);
        setLatestScreening(null);
      }
    };
    fetchLatestScreening();
  }, [currentUser]);

  // Fetch tips from database and refresh periodically for near-realtime updates
  useEffect(() => {
    let isMounted = true;
    const fetchTips = async () => {
      try {
        setTipsLoading(true);
        const response = await getAllTips();
        if (!isMounted) return;
        setTips(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching tips:', error);
        if (!isMounted) return;
        setTips([]);
      } finally {
        if (!isMounted) return;
        setTipsLoading(false);
      }
    };

    fetchTips();
    const intervalId = setInterval(fetchTips, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Map database tips to display format
  const getDisplayColor = (category) => {
    const colors = {
      'Relaksasi': { imgBg: 'linear-gradient(135deg, #8CC7C4 0%, #7AB2B2 100%)', linkColor: '#09637E' },
      'Tidur Sehat': { imgBg: 'linear-gradient(135deg, #7AB2B2 0%, #088395 100%)', linkColor: '#09637E' },
      'Fokus Belajar': { imgBg: 'linear-gradient(135deg, #088395 0%, #09637E 100%)', linkColor: '#088395' },
    };
    return colors[category] || { imgBg: 'linear-gradient(135deg, #088395 0%, #09637E 100%)', linkColor: '#088395' };
  };

  const displayTips = tips.map(tip => ({
    id: tip.id_tips,
    category: tip.category,
    tag: tip.category,
    title: tip.title,
    desc: tip.description || '',
    content: tip.content || tip.isi || '',
    ...getDisplayColor(tip.category),
    tagBg: 'rgba(255,255,255,0.88)',
    tagColor: '#09637E',
  }));

  const filteredSaran = activeCategory === 'Semua'
    ? displayTips
    : displayTips.filter(s => s.category === activeCategory);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .db-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        .db-scroll::-webkit-scrollbar { display: none; }
        .db-scroll { -ms-overflow-style: none; scrollbar-width: none; }

        .db-root {
          position: relative;
          height: 100%;
          width: 100%;
          background-size: cover;
          background-position: top center;
          background-repeat: no-repeat;
          overflow-y: auto;
          overflow-x: hidden;
        }
 
        .db-feature-card {
          border-radius: 16px;
          padding: 16px 14px 14px;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          position: relative;
          overflow: hidden;
        }

        .db-feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.12);
        }

        .db-feature-card:active { transform: scale(0.96); }

        .db-feature-filled {
          background: linear-gradient(135deg, #50A1C1 0%, #264C5B 100%);
          color: #fff;
          box-shadow: 0 6px 18px rgba(38,76,91,0.32);
        }

        .db-feature-filled:hover {
          box-shadow: 0 14px 28px rgba(38,76,91,0.45);
        }

        .db-feature-outline {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          color: #1e293b;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .db-feature-outline:hover {
          border-color: #0096a1;
          box-shadow: 0 8px 20px rgba(0,150,161,0.15);
        }

        .db-cat-btn {
          padding: 7px 16px;
          border-radius: 999px;
          border: 1.5px solid #cbd5e1;
          background: transparent;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.18s ease;
          font-family: 'Poppins', sans-serif;
          color: #64748b;
        }
        .db-cat-btn.active {
          background: #fff;
          border-color: #088395;
          color: #09637E;
          box-shadow: 0 2px 8px rgba(8,131,149,0.18);
        }
        .db-cat-btn:hover {
          background: #E1F0F6;
          border-color: #0096a1;
          color: #0096a1;
        }
        .db-cat-btn:hover:not(.active) {
          background: #e6f4f4;
          border-color: #7AB2B2;
          color: #09637E;
        }

        .db-saran-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 3px 12px rgba(0,0,0,0.08);
          cursor: pointer;
          transition: transform 0.15s ease;
          background: #fff;
        }
        .db-saran-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 22px rgba(0,0,0,0.12);
        }
          
        .db-saran-card:active { transform: scale(0.97); }

        @keyframes db-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .db-fadein { animation: db-fadein 0.35s ease forwards; }
      `}</style>

        <div
          className="db-root db-scroll"
          style={{ backgroundImage: `url(${dashboardBg})` }}
        >

        {/* ── All content ── */}
        <div style={{ position: 'relative', zIndex: 1, paddingBottom: 36 }}>

          {/* ════ HEADER ════ */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 20px 10px',
            }}>

              {/* LEFT: ROBOT + TEXT */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <img
                  src={headRobot}
                  alt="robot"
                  style={{
                    width: 48,
                    height: 48,
                    objectFit: 'contain'
                  }}
                />

                <div>
                  <p style={{
                    margin: 0,
                    fontSize: 12,
                    color: '#64748b'
                  }}>
                    {t('dashboard.welcome')}
                  </p>

                  <p style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 800,
                    color: '#1e293b',
                    lineHeight: 1.2
                  }}>
                    {userName}
                  </p>
                </div>
              </div>

              {/* RIGHT: PROFILE ICON (PNG) */}
              <button
                onClick={onProfileClick}
                style={{
                  width: 51,
                  height: 51,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 3
                }}
              >
                <img
                  src={profileIcon}
                  alt="profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </button>
            </div>

          {/* ════ SCREENING CARD ════ */}
            <div style={{ padding: '0 20px', marginBottom: 22, marginTop: 10 }}>
              <div style={{
                borderRadius: 22,
                background: 'linear-gradient(130deg, #50A1C1 0%, #264C5B 100%)',
                boxShadow: '0 10px 28px rgba(38,76,91,0.35)',
                padding: '15px',
                position: 'relative',
                overflow: 'visible',
                minHeight: 150,
                display: 'flex',
                alignItems: 'center'
              }}>

                {/* TEXT */}
                <div style={{ zIndex: 2, maxWidth: '60%' }}>
                  <p style={{
                    margin: 0,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.75)'
                  }}>
                    Hasil Screening Terakhir
                  </p>

                  <p style={{
                    margin: '6px 0',
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#fff'
                  }}>
                    {latestScreening 
                      ? `${latestScreening.score} – Stress ${getStressLevel(latestScreening.score)}`
                      : t('dashboard.noResults')
                    }
                  </p>

                  <p style={{
                    margin: 0,
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.7)'
                  }}>
                    {latestScreening ? getDaysAgo(latestScreening.created_at) : ''}
                  </p>
                </div>

                {/* ROBOT (FIX UTAMA DI SINI) */}
                <img
                  src={screeningRobot}
                  alt="robot"
                  style={{
                    position: 'absolute',
                    right: -2,
                    bottom: -20,
                    width: 120,
                    height: 'auto',
                    zIndex: 2,
                    pointerEvents: 'none'
                  }}
                />
              </div>
            </div>

          {/* ════ FITUR UTAMA ════ */}
          <div style={{ padding: '0 20px', marginBottom: 26 }}>
              <h2 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 800, color: '#1e293b', letterSpacing: -0.3 }}>
                {t('dashboard.featureTitle')}
              </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {FEATURES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onFeatureClick?.(f.id)}
                  className={`db-feature-card ${f.filled ? 'db-feature-filled' : 'db-feature-outline'}`}
                  style={{ textAlign: 'left', border: f.filled ? 'none' : '1.5px solid #e2e8f0' }}
                >
                  {/* Icon circle */}
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 10,
                    background: f.filled ? 'rgba(255,255,255,0.18)' : 'rgba(0,150,161,0.10)',
                    color: f.filled ? '#fff' : '#0096a1',
                  }}>
                    {f.icon}
                  </div>

                  <p style={{
                    margin: '0 0 4px',
                    fontSize: 14,
                    fontWeight: 700,
                    color: f.filled ? '#fff' : '#1e293b',
                    lineHeight: 1.2,
                  }}>
                    {f.label}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: 11.5,
                    fontWeight: 400,
                    color: f.filled ? 'rgba(255,255,255,0.80)' : '#64748b',
                    lineHeight: 1.5,
                  }}>
                    {f.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* ════ SARAN ════ */}
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b', letterSpacing: -0.3 }}>
                  {t('dashboard.suggestionsTitle')}
                </h2>
            </div>

            {/* Filter chips — scrollable horizontal */}
            <div
              className="db-scroll"
              style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                marginBottom: 16,
                paddingBottom: 2,
              }}
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`db-cat-btn${activeCategory === cat ? ' active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {filteredSaran.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onTipSelect?.(s)}
                  className="db-saran-card db-fadein"
                  style={{ animationDelay: `${i * 60}ms`, textAlign: 'left', background: '#fff', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  {/* Image area */}
                  <div style={{
                    height: 72,
                    background: s.imgBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    padding: '0 12px',
                  }}>
                    {/* Tag badge */}
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      background: s.tagBg,
                      borderRadius: 999,
                      padding: '2px 8px',
                      fontSize: 9.5,
                      fontWeight: 600,
                      color: s.tagColor,
                    }}>
                      {s.tag}
                    </div>
                  </div>

                  {/* Text area */}
                  <div style={{ padding: '10px 12px 12px', background: '#fff' }}>
                    <p style={{
                      margin: '0 0 4px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#1e293b',
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {s.title}
                    </p>
                    <p style={{
                      margin: '0 0 8px',
                      fontSize: 10.5,
                      color: '#64748b',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {s.desc}
                    </p>
                    <div
                      style={{
                        marginTop: 10,
                        fontSize: 10.5,
                        fontWeight: 600,
                        color: s.linkColor,
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      {t('dashboard.readMore')}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </>
  );
};

export default Dashboard;
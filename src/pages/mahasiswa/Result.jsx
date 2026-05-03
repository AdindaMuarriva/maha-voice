import { useEffect, useMemo, useState } from 'react';
import resultBg from '../../assets/instructionbg.png';
import sadRobot from '../../assets/sad.png';
import { getRecommendationByLevel } from '../../services/adminApi';

const Result = ({ score = 0, totalScore = 40, onBack }) => {

  const safeTotalScore = Math.max(Number(totalScore) || 40, 1);
  const percentage = Math.min((score / safeTotalScore) * 100, 100);

  const getCategory = () => {
    if (percentage <= 33) return { label: 'Stres Ringan', color: '#22c55e' };
    if (percentage <= 66) return { label: 'Stres Sedang', color: '#f59e0b' };
    return { label: 'Stres Berat', color: '#ef4444' };
  };

  const category = getCategory();

  const recommendationLevel = useMemo(() => {
    if (category.label === 'Stres Ringan') return 'Rendah';
    if (category.label === 'Stres Sedang') return 'Sedang';
    return 'Berat';
  }, [category.label]);

  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);
  const [recommendationError, setRecommendationError] = useState('');

  useEffect(() => {
    let active = true;

    const loadRecommendation = async () => {
      try {
        setLoadingRecommendation(true);
        const result = await getRecommendationByLevel(recommendationLevel);
        if (!active) return;
        setRecommendation(result?.recommendation || null);
        setRecommendationError('');
      } catch (error) {
        if (active) {
          setRecommendation(null);
          setRecommendationError(error.message || 'Gagal memuat rekomendasi');
        }
      } finally {
        if (active) setLoadingRecommendation(false);
      }
    };

    loadRecommendation();

    return () => {
      active = false;
    };
  }, [recommendationLevel]);

  const fallbackSuggestions = [
    'Hubungi konselor atau psikolog',
    'Cerita ke orang yang kamu percaya',
    'Kurangi beban aktivitas sementara',
    'Lakukan latihan napas sederhana',
  ];

  const recommendationItems = recommendation?.items?.length ? recommendation.items : fallbackSuggestions;

  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  const currentMonth = new Date().getMonth(); 
  const visibleMonths = Array.from({ length: 6 }, (_, i) => {
  const index = (currentMonth - 5 + i + 12) % 12;
  return {
    label: months[index],
    isActive: i <= 5 
  };
});
  const activeMonthIndex = currentMonth % 6; 

  const screeningCount = 1;

  const handleSave = () => {
    console.log("Saved score:", score);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .rs-root * { font-family: 'Poppins', sans-serif; }

        .rs-root {
          height: 100%;
          overflow-y: auto;
          background-image: url(${resultBg});
          background-size: cover;
          background-position: top;
        }

        .rs-overlay {
          background: rgba(255,255,255,0.8);
          min-height: 100%;
          padding: 20px;
        }

        .card {
          background: #fff;
          border-radius: 18px;
          padding: 16px;
          border: 1.5px solid #dbe5ea; /* FIX border lebih jelas */
        }

        .card-strong {
          border: 2px solid #3C7A92;
        }

        .btn-primary {
          width: 100%;
          padding: 12px;
          background: #3C7A92;
          color: white;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #2f6478;
          transform: translateY(-1px);
        }

        .btn-secondary {
          width: 100%;
          padding: 12px;
          background: transparent;
          border: 2px solid #3C7A92;
          color: #3C7A92;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #eaf4f7;
        }

        .music-card {
          border: 2px solid #3C7A92; /* FIX biar keliatan */
          border-radius: 18px;
          padding: 14px;
        }

        .control-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #3C7A92;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .control-btn:hover {
          transform: scale(1.1);
          background: #2f6478;
        }

        .recommendation-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: #E1F0F6;
          color: #3C7A92;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>

      <div className="rs-root">
        <div className="rs-overlay">

          {/* TITLE */}
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#3C7A92', marginBottom: 20, marginTop: 13, textAlign: 'center' }}>
            Hasil Screening Stress
          </h1>

          {/* TOP */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>

            {/* LEFT */}
            <div className="card card-strong" style={{ flex: 1, textAlign: 'center' }}>
              <img src={sadRobot} style={{ width: 75, marginBottom: 8 }} />
              <h2 style={{ margin: 0, color: '#3C7A92' }}>{screeningCount}x</h2>
              <p style={{ fontSize: 12, color: '#64748b' }}>
                Screening Bulan Ini
              </p>
            </div>

            {/* RIGHT */}
            <div className="card" style={{ flex: 2 }}>
              <h2 style={{ fontSize: 30, margin: 0, color: category.color }}>
                {score}<span style={{ fontSize: 16 }}>{`/${safeTotalScore}`}</span>
              </h2>

              <p style={{ fontSize: 12, margin: '6px 0' }}>
                Skor Screening Terakhir
              </p>

              {/* PROGRESS */}
              <div style={{ height: 8, background: '#e5e7eb', borderRadius: 999 }}>
                <div style={{
                  width: `${percentage}%`,
                  height: '100%',
                  background: category.color,
                  borderRadius: 999
                }} />
              </div>

              {/* LABEL */}
              <div style={{
                marginTop: 8,
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: 999,
                background: category.color + '33',
                color: category.color,
                fontSize: 11,
                fontWeight: 600
              }}>
                {category.label}
              </div>

              {/* MONTH */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                {visibleMonths.map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: i === 5 ? '#3C7A92' : '#d1d5db',
                    margin: '0 auto 4px'
                    }} />
                    <span style={{ fontSize: 10 }}>{m.label}</span>
                </div>
                ))}
              </div>
            </div>
          </div>

            {/* SARAN */}
            <h3 style={{ color: '#3C7A92', marginBottom: 10, fontWeight: 700 }}>
            Saran untukmu
            </h3>

            <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 10 }}>
              <span className="recommendation-badge">
                {recommendation?.title || category.label}
              </span>
              {recommendation?.description && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                  {recommendation.description}
                </p>
              )}
              {loadingRecommendation && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: '#64748b' }}>
                  Memuat rekomendasi...
                </p>
              )}
              {recommendationError && !loadingRecommendation && (
                <p style={{ margin: '8px 0 0', fontSize: 12, color: '#b45309' }}>
                  {recommendationError}
                </p>
              )}
            </div>
            <ul
                style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
                }}
            >
                {recommendationItems.map((s, i) => (
                <li
                    key={i}
                    style={{
                    position: 'relative',
                    paddingLeft: 16,
                    marginBottom: 8,
                    fontSize: 13,
                    color: '#1e293b',
                    lineHeight: 1.6
                    }}
                >
                    {/* bullet custom */}
                    <span
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 7,
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: '#3C7A92'
                    }}
                    />
                    {s}
                </li>
                ))}
            </ul>
            </div>

          {/* MUSIC */}
          <h3 style={{ color: '#3C7A92', marginBottom: 10, fontWeight: 700 }}>
            Musik untukmu
          </h3>

          <div className="music-card" style={{ marginBottom: 20 }}>

            {/* TOP */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 10,
                background: '#cbd5f5'
              }} />
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>
                  Calm & Rain Piano
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                  Relaxing Ghibli • YouTube
                </p>
                <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#3C7A92',
                    background: '#E1F0F6',
                    borderRadius: 999
                }}
                >
                <span
                    style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#3C7A92'
                    }}
                />
                Sedang diputar
                </span>
              </div>
            </div>

            {/* PROGRESS */}
            <div style={{
              height: 6,
              background: '#e5e7eb',
              borderRadius: 999,
              margin: '10px 0'
            }}>
              <div style={{
                width: '60%',
                height: '100%',
                background: '#3C7A92',
                borderRadius: 999
              }} />
            </div>

            {/* TIME */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              color: '#64748b'
            }}>
              <span>1:21</span>
              <span>3:42</span>
            </div>

            {/* CONTROLS */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 14,
              marginTop: 12
            }}>
              <div className="control-btn">⏮</div>
              <div className="control-btn" style={{ width: 48, height: 48 }}>▶</div>
              <div className="control-btn">⏭</div>
            </div>

          </div>

          {/* BUTTONS */}
          <button onClick={handleSave} className="btn-primary" style={{ marginBottom: 10 }}>
            Simpan & Lihat Riwayat
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => {
                    handleSave();
                    onBack();
                }}
            >
            Simpan & Kembali ke Beranda
          </button>

        </div>
      </div>
    </>
  );
};

export default Result;
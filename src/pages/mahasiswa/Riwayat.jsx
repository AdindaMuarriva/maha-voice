import { useEffect, useMemo, useState } from 'react';
import bgRiwayat from '../../assets/bgriwayat.png';
import { getUserScreeningHistory } from '../../services/adminApi';

// ─────────────────────────────────────────────
const CATEGORIES = ['Semua', 'Rendah', 'Sedang', 'Berat'];

const LEVEL_STYLE = {
  Berat:  { bg: '#FDDCDC', color: '#E05C5C', dot: '#E05C5C' },
  Sedang: { bg: '#FAFAD2', color: '#9A9A2A', dot: '#BFBF3A' },
  Rendah: { bg: '#D6EEF8', color: '#3A8FB5', dot: '#4AAAD0' },
};

const mapHistoryItem = (item) => {
  const date = item?.tanggal ? new Date(item.tanggal) : new Date();
  const isValidDate = !Number.isNaN(date.getTime());

  return {
    id: item?.id_riwayat || `${item?.id_hasil || 'history'}-${item?.tanggal || Date.now()}`,
    tanggal: isValidDate ? String(date.getDate()) : '-',
    bulan: isValidDate
      ? new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date)
      : '-',
    label: `Stres ${item?.level || 'Rendah'}`,
    skor: Number(item?.skor) || 0,
    total: Number(item?.total_score) || 40,
    level: item?.level || 'Rendah',
  };
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Riwayat = ({ onBack, currentUser }) => {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      const userId = currentUser?.id_user;

      if (!userId) {
        if (active) {
          setHistory([]);
          setLoading(false);
          setError('User belum login, riwayat belum bisa ditampilkan.');
        }
        return;
      }

      try {
        setLoading(true);
        const result = await getUserScreeningHistory(userId);
        const histories = Array.isArray(result?.histories) ? result.histories : [];

        if (!active) {
          return;
        }

        setHistory(histories.map(mapHistoryItem));
        setError('');
      } catch (err) {
        if (active) {
          setHistory([]);
          setError(err.message || 'Gagal memuat riwayat screening');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, [currentUser?.id_user]);

  const filtered = useMemo(() => (
    activeCategory === 'Semua'
      ? history
      : history.filter((item) => item.level === activeCategory)
  ), [activeCategory, history]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .rw-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .rw-root::-webkit-scrollbar { display: none; }
        .rw-root {
          -ms-overflow-style: none;
          scrollbar-width: none;
          position: relative;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          background-image: url(${bgRiwayat});
          background-size: cover;
          background-position: bottom center;
          background-repeat: no-repeat;
        }

        .rw-cat-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          flex-wrap: nowrap;
          -ms-overflow-style: none;
          scrollbar-width: none;
          padding-bottom: 2px;
        }
        .rw-cat-scroll::-webkit-scrollbar { display: none; }

        .rw-cat-btn {
          padding: 8px 22px;
          border-radius: 999px;
          border: 1.5px solid #088395;
          background: transparent;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.18s ease;
          font-family: 'Poppins', sans-serif;
          color: #088395;
        }
        .rw-cat-btn.active {
          background: #088395;
          color: #fff;
          box-shadow: 0 2px 10px rgba(8,131,149,0.28);
        }
        .rw-cat-btn:hover:not(.active) {
          background: #e6f4f4;
        }

        .rw-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 0;
          border-bottom: 1px solid #e2e8f0;
          transition: opacity 0.15s;
        }
        .rw-item:last-child { border-bottom: none; }

        .rw-date-box {
          width: 54px;
          height: 54px;
          border-radius: 10px;
          border: 1.5px solid #088395;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: #fff;
        }

        .rw-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 10.5px;
          font-weight: 500;
          white-space: nowrap;
        }

        @keyframes rw-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .rw-fadein { animation: rw-fadein 0.28s ease both; }

        .rw-back-btn {
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
        .rw-back-btn:hover { color: #09637E; }
      `}</style>

      <div className="rw-root">
        <div style={{ padding: '52px 20px 120px', position: 'relative', zIndex: 1 }}>

          {/* ════ BACK ════ */}
          <button className="rw-back-btn" onClick={onBack} style={{ marginBottom: 20 }}>
            ‹ Kembali ke Beranda
          </button>

          {/* ════ HEADER ════ */}
          <h1 style={{
            margin: '0 0 20px',
            fontSize: 22,
            fontWeight: 700,
            color: '#088395',
            letterSpacing: -0.2,
            lineHeight: 1.3,
          }}>
            Riwayat Screening Stress
          </h1>

          {/* ════ CATEGORY TABS ════ */}
          <div className="rw-cat-scroll" style={{ marginBottom: 24 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`rw-cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ════ LIST ════ */}
          <div style={{ background: 'rgba(255,255,255,0.75)', borderRadius: 16, padding: '0 16px', backdropFilter: 'blur(6px)' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '32px 0', fontSize: 14 }}>
                Memuat riwayat screening...
              </p>
            ) : error ? (
              <p style={{ textAlign: 'center', color: '#b91c1c', padding: '32px 0', fontSize: 14 }}>
                {error}
              </p>
            ) : filtered.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '32px 0', fontSize: 14 }}>
                Tidak ada data untuk kategori ini.
              </p>
            ) : (
              filtered.map((item, i) => {
                const style = LEVEL_STYLE[item.level];
                return (
                  <div
                    key={item.id}
                    className="rw-item rw-fadein"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Date box */}
                    <div className="rw-date-box">
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#088395', lineHeight: 1 }}>
                        {item.tanggal}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 500, color: '#088395', lineHeight: 1.5 }}>
                        {item.bulan}
                      </span>
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                        {item.label}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748b' }}>
                        Skor: {item.skor} dari {item.total}
                      </p>
                    </div>

                    {/* Badge */}
                    <div
                      className="rw-badge"
                      style={{ background: style.bg, color: style.color }}
                    >
                      <span style={{
                        width: 7, height: 7,
                        borderRadius: '50%',
                        background: style.dot,
                        flexShrink: 0,
                        display: 'inline-block',
                      }} />
                      {item.label}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Riwayat;
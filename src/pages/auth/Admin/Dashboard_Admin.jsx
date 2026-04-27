import { useEffect, useMemo, useState } from 'react';
import { getAdminDashboard } from '../../../services/adminApi';
import bgAdmin from '../../../assets/BG_Admin.png';

const LEVEL_META = {
  Rendah: { color: '#3A8FB5', bg: '#D6EEF8' },
  Sedang: { color: '#B08900', bg: '#FAFAD2' },
  Berat: { color: '#E05C5C', bg: '#FDDCDC' },
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

const formatPercent = (value, total) => {
  if (!total) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

const Dashboard_Admin = ({ onNavigate }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        const result = await getAdminDashboard();
        if (active) setDashboard(result);
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat dashboard admin');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const summary = dashboard?.summary || {
    totalMahasiswa: 0,
    totalScreening: 0,
    distribusi: [
      { label: 'Rendah', value: 0 },
      { label: 'Sedang', value: 0 },
      { label: 'Berat', value: 0 },
    ],
  };

  const compositionTotal = useMemo(
    () => summary.distribusi.reduce((accumulator, item) => accumulator + item.value, 0),
    [summary.distribusi],
  );

  return (
    <div
      className="admin-page-bg"
      style={{
        minHeight: '100vh',
        color: '#183041',
        padding: 20,
        backgroundColor: '#f8fbfe',
        backgroundImage: `linear-gradient(rgba(248, 251, 254, 0), rgba(248, 251, 254, 0)), url(${bgAdmin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .admin-root, .admin-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .admin-page-bg { background-attachment: fixed; }
        .admin-shell { display: grid; grid-template-columns: 250px 1fr; gap: 24px; align-items: start; }
        .admin-sidebar {
          background: rgba(217, 238, 247, 0.88);
          border-radius: 24px;
          padding: 22px 18px;
          min-height: calc(100vh - 40px);
          box-shadow: 0 18px 50px rgba(24, 48, 65, 0.08);
        }
        .admin-menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }
        .admin-menu-item {
          padding: 14px 16px;
          border-radius: 16px;
          background: transparent;
          color: #4a7e95;
          font-size: 14px;
          font-weight: 700;
          border: none;
          text-align: left;
        }
        .admin-menu-item.active {
          background: rgba(255,255,255,0.75);
          color: #1b5a72;
          box-shadow: inset 4px 0 0 #3c7a92;
        }
        .admin-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .admin-header {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 24px;
          padding: 22px 24px;
          box-shadow: 0 14px 40px rgba(24, 48, 65, 0.06);
        }
        .admin-title {
          margin: 0;
          color: #3c7a92;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .admin-subtitle {
          margin: 6px 0 0;
          color: #6b7f8c;
          font-size: 14px;
        }
        .admin-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }
        .admin-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 20px;
          padding: 18px 20px;
          box-shadow: 0 14px 40px rgba(24, 48, 65, 0.06);
        }
        .admin-card-value {
          margin: 0;
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .admin-card-label {
          margin: 2px 0 0;
          color: #6b7f8c;
          font-size: 13px;
          font-weight: 600;
        }
        .admin-section-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 16px;
        }
        .admin-section-title {
          margin: 0 0 14px;
          color: #3c7a92;
          font-size: 18px;
          font-weight: 800;
        }
        .admin-bar-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .admin-bar-item {
          display: grid;
          grid-template-columns: 96px 1fr 48px;
          gap: 12px;
          align-items: center;
        }
        .admin-bar-track {
          height: 18px;
          background: #edf3f7;
          border-radius: 999px;
          overflow: hidden;
        }
        .admin-bar-fill {
          height: 100%;
          border-radius: inherit;
        }
        .admin-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th,
        .admin-table td {
          text-align: left;
          padding: 14px 10px;
          border-bottom: 1px solid #edf3f7;
          font-size: 13px;
        }
        .admin-table th {
          color: #3c7a92;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 86px;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .admin-muted { color: #6b7f8c; }
        @media (max-width: 1100px) {
          .admin-shell { grid-template-columns: 1fr; }
          .admin-sidebar { min-height: auto; }
          .admin-grid-4, .admin-section-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 700px) {
          .admin-grid-4, .admin-section-grid { grid-template-columns: 1fr; }
          .admin-bar-item { grid-template-columns: 80px 1fr 42px; }
        }
      `}</style>

      <div className="admin-root admin-shell">
        <aside className="admin-sidebar">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1b5a72' }}>mahavoice</div>
            <div style={{ fontSize: 12, color: '#4a7e95', fontWeight: 600 }}>Panel Admin</div>
          </div>

          <nav className="admin-menu">
            <button className="admin-menu-item active" type="button" onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
            <button className="admin-menu-item" type="button" onClick={() => onNavigate?.('users')}>Mahasiswa</button>
            <button className="admin-menu-item" type="button" onClick={() => onNavigate?.('questions')}>Pertanyaan</button>
            <button className="admin-menu-item" type="button" onClick={() => onNavigate?.('recommendation')}>Rekomendasi</button>
            <button className="admin-menu-item" type="button" onClick={() => onNavigate?.('tips')}>Tips & Musik</button>
            <button className="admin-menu-item" type="button" onClick={() => onNavigate?.('results')}>Hasil Screening</button>
          </nav>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <h1 className="admin-title">Dashboard Admin</h1>
            <p className="admin-subtitle">
              Ringkasan data mahasiswa dan hasil screening stres dari tabel Supabase.
            </p>
          </div>

          {loading && (
            <div className="admin-card">Memuat data dashboard...</div>
          )}

          {error && !loading && (
            <div className="admin-card" style={{ color: '#b91c1c' }}>{error}</div>
          )}

          {dashboard?.note && !loading && (
            <div className="admin-card" style={{ color: '#9a6b00', background: '#fff7e6' }}>
              {dashboard.note}
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="admin-grid-4">
                <article className="admin-card">
                  <p className="admin-card-value" style={{ color: '#3c7a92' }}>{summary.totalMahasiswa}</p>
                  <p className="admin-card-label">Total Mahasiswa</p>
                </article>
                <article className="admin-card">
                  <p className="admin-card-value" style={{ color: '#3c7a92' }}>{summary.totalScreening}</p>
                  <p className="admin-card-label">Hasil Screening</p>
                </article>
                <article className="admin-card">
                  <p className="admin-card-value" style={{ color: '#f59e0b' }}>
                    {summary.distribusi.find((item) => item.label === 'Sedang')?.value || 0}
                  </p>
                  <p className="admin-card-label">Stres Sedang</p>
                </article>
                <article className="admin-card">
                  <p className="admin-card-value" style={{ color: '#ef4444' }}>
                    {summary.distribusi.find((item) => item.label === 'Berat')?.value || 0}
                  </p>
                  <p className="admin-card-label">Stres Berat</p>
                </article>
              </section>

              <section className="admin-section-grid">
                <article className="admin-card">
                  <h2 className="admin-section-title">Distribusi Tingkat Stres</h2>
                  <div className="admin-bar-list">
                    {summary.distribusi.map((item) => {
                      const meta = LEVEL_META[item.label] || LEVEL_META.Rendah;
                      const max = Math.max(...summary.distribusi.map((entry) => entry.value), 1);
                      const width = `${(item.value / max) * 100}%`;

                      return (
                        <div key={item.label} className="admin-bar-item">
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#183041' }}>{item.label}</div>
                          <div className="admin-bar-track">
                            <div className="admin-bar-fill" style={{ width, background: meta.color }} />
                          </div>
                          <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: meta.color }}>
                            {item.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>

                <article className="admin-card">
                  <h2 className="admin-section-title">Komposisi Level Stres</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {summary.distribusi.map((item) => {
                      const meta = LEVEL_META[item.label] || LEVEL_META.Rendah;
                      return (
                        <div key={item.label} className="admin-chip" style={{ background: meta.bg, color: meta.color }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: meta.color, display: 'inline-block' }} />
                          <span>{item.label}</span>
                          <span className="admin-muted" style={{ fontWeight: 600 }}>
                            {item.value} mahasiswa ({formatPercent(item.value, compositionTotal)})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </section>

              <section className="admin-card">
                <h2 className="admin-section-title">Screening Terbaru</h2>
                {dashboard?.screeningTerbaru?.length ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Nama</th>
                          <th>NPM</th>
                          <th>Email</th>
                          <th>Skor</th>
                          <th>Level</th>
                          <th>Tanggal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.screeningTerbaru.map((item) => {
                          const meta = LEVEL_META[item.level] || LEVEL_META.Rendah;
                          return (
                            <tr key={item.id}>
                              <td>{item.nama}</td>
                              <td>{item.npm}</td>
                              <td>{item.email}</td>
                              <td>{item.score}/{item.total_score}</td>
                              <td>
                                <span className="admin-badge" style={{ background: meta.bg, color: meta.color }}>
                                  {item.level}
                                </span>
                              </td>
                              <td>{formatDate(item.created_at)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-muted">Belum ada data screening yang tersimpan.</div>
                )}
              </section>

              <section className="admin-card">
                <h2 className="admin-section-title">Mahasiswa</h2>
                {dashboard?.mahasiswa?.length ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Nama</th>
                          <th>NPM</th>
                          <th>Email</th>
                          <th>Dibuat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.mahasiswa.slice(0, 6).map((item) => (
                          <tr key={item.id_user}>
                            <td>{item.nama}</td>
                            <td>{item.npm}</td>
                            <td>{item.email}</td>
                            <td>{formatDate(item.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-muted">Belum ada data mahasiswa.</div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard_Admin;

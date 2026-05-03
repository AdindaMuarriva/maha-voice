import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminUsers } from '../../../services/adminApi';

const LEVEL_STYLE = {
  Rendah: { bg: '#dbeafe', color: '#1d4ed8' },
  Sedang: { bg: '#fef9c3', color: '#a16207' },
  Berat: { bg: '#fee2e2', color: '#b91c1c' },
  '-': { bg: '#e5e7eb', color: '#4b5563' },
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

const Daftar_Users = ({ onNavigate }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        const result = await getAdminUsers(500);
        if (!active) return;
        setRows(Array.isArray(result?.rows) ? result.rows : []);
        setError('');
      } catch (err) {
        if (active) {
          setRows([]);
          setError(err.message || 'Gagal memuat data mahasiswa');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => ({
    total: rows.length,
    aktifScreening: rows.filter((item) => Number(item.total_screening) > 0).length,
    belumScreening: rows.filter((item) => Number(item.total_screening) === 0).length,
    tertinggi: rows.reduce((max, item) => Math.max(max, Number(item.total_screening) || 0), 0),
  }), [rows]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;

    return rows.filter((item) =>
      [item.nama, item.npm, item.email]
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(term)),
    );
  }, [rows, search]);

  return (
    <AdminLayout
      activePage="users"
      title="Mahasiswa"
      subtitle="Daftar akun mahasiswa yang tersimpan di tabel users Supabase."
      onNavigate={onNavigate}
    >
      <style>{`
        .user-stack { display: grid; gap: 16px; }
        .user-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .user-stat {
          background: #fff;
          border: 1px solid #dbe8ef;
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 12px 30px rgba(24, 48, 65, 0.04);
        }
        .user-label { margin: 0 0 6px; color: #6b7f8c; font-size: 12px; font-weight: 700; }
        .user-value { margin: 0; color: #183041; font-size: 24px; font-weight: 800; }
        .user-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .user-input {
          flex: 1;
          min-width: 240px;
          border: 1px solid #dbe8ef;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          font-family: inherit;
        }
        .user-table-wrap { overflow-x: auto; }
        .user-table { width: 100%; border-collapse: collapse; min-width: 940px; }
        .user-table th,
        .user-table td { padding: 12px 10px; border-bottom: 1px solid #edf3f7; text-align: left; font-size: 13px; }
        .user-table th { color: #3c7a92; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
        .level-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>

      <div className="user-stack">
        <div className="user-grid">
          <div className="user-stat"><p className="user-label">Total User</p><p className="user-value">{stats.total}</p></div>
          <div className="user-stat"><p className="user-label">Sudah Screening</p><p className="user-value">{stats.aktifScreening}</p></div>
          <div className="user-stat"><p className="user-label">Belum Screening</p><p className="user-value">{stats.belumScreening}</p></div>
          <div className="user-stat"><p className="user-label">Screening Terbanyak</p><p className="user-value">{stats.tertinggi}</p></div>
        </div>

        <div className="admin-card">
          <div className="user-toolbar" style={{ marginBottom: 12 }}>
            <input
              className="user-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, npm, email, atau role"
            />
          </div>

          {loading ? (
            <div style={{ color: '#6b7f8c' }}>Memuat daftar mahasiswa...</div>
          ) : error ? (
            <div style={{ color: '#b91c1c' }}>{error}</div>
          ) : (
            <div className="user-table-wrap">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>NPM</th>
                    <th>Email</th>
                    <th>Registrasi</th>
                    <th>Total Screening</th>
                    <th>Terakhir Screening</th>
                    <th>Level Terakhir</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ color: '#6b7f8c' }}>Tidak ada data mahasiswa yang cocok.</td>
                    </tr>
                  ) : (
                    filteredRows.map((item) => {
                      const style = LEVEL_STYLE[item.last_level] || LEVEL_STYLE['-'];
                      return (
                        <tr key={item.id_user}>
                          <td>{item.nama}</td>
                          <td>{item.npm}</td>
                          <td>{item.email}</td>
                          <td>{formatDate(item.created_at)}</td>
                          <td>{item.total_screening}</td>
                          <td>{formatDate(item.last_screening_at)}</td>
                          <td>
                            <span className="level-pill" style={{ background: style.bg, color: style.color }}>
                              {item.last_level}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Daftar_Users;

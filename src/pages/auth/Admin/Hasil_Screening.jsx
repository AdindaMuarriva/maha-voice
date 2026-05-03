import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminScreeningResults } from '../../../services/adminApi';

const LEVEL_STYLE = {
  Rendah: { bg: '#dbeafe', color: '#1d4ed8' },
  Sedang: { bg: '#fef9c3', color: '#a16207' },
  Berat: { bg: '#fee2e2', color: '#b91c1c' },
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

const formatCsvDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `'${year}-${month}-${day}`;
};

const escapeCsvValue = (value) => {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
};

const downloadCsv = (rows) => {
  const header = ['Tanggal', 'Nama', 'NPM', 'Email', 'Skor', 'Total Skor', 'Level'];
  const lines = [
    header.map(escapeCsvValue).join(','),
    ...rows.map((item) => [
      formatCsvDate(item.tanggal),
      item.nama,
      item.npm || '-',
      item.email || '-',
      item.skor,
      item.total_score || 40,
      item.level,
    ].map(escapeCsvValue).join(',')),
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hasil-screening-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const Hasil_Screening = ({ onNavigate }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('Semua');

  useEffect(() => {
    let active = true;

    const loadRows = async () => {
      try {
        setLoading(true);
        const result = await getAdminScreeningResults(300);
        if (!active) {
          return;
        }
        setRows(Array.isArray(result?.rows) ? result.rows : []);
        setError('');
      } catch (err) {
        if (active) {
          setRows([]);
          setError(err.message || 'Gagal memuat hasil screening admin');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRows();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const summary = rows.reduce(
      (accumulator, item) => {
        accumulator.total += 1;
        accumulator[item.level] = (accumulator[item.level] || 0) + 1;
        return accumulator;
      },
      { total: 0, Rendah: 0, Sedang: 0, Berat: 0 },
    );

    return summary;
  }, [rows]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((item) => {
      const matchesLevel = levelFilter === 'Semua' || item.level === levelFilter;
      const matchesSearch = !term || [item.nama, item.npm, item.email]
        .map((value) => String(value || '').toLowerCase())
        .some((value) => value.includes(term));

      return matchesLevel && matchesSearch;
    });
  }, [rows, search, levelFilter]);

  return (
    <AdminLayout
      activePage="results"
      title="Hasil Screening"
      subtitle="Riwayat hasil screening seluruh mahasiswa dari tabel screenings."
      onNavigate={onNavigate}
    >
      <style>{`
        .result-stack { display: grid; gap: 16px; }
        .result-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .result-stat {
          background: #fff;
          border: 1px solid #dbe8ef;
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 12px 30px rgba(24, 48, 65, 0.04);
        }
        .result-label { margin: 0 0 6px; color: #6b7f8c; font-size: 12px; font-weight: 700; }
        .result-value { margin: 0; color: #183041; font-size: 24px; font-weight: 800; }
        .result-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .result-input,
        .result-select {
          border: 1px solid #dbe8ef;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          font-family: inherit;
        }
        .result-input { flex: 1; min-width: 240px; }
        .result-btn {
          border: none;
          border-radius: 999px;
          padding: 10px 16px;
          background: linear-gradient(135deg, #3c7a92 0%, #2b657a 100%);
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(60,122,146,0.22);
        }
        .result-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
        .result-table-wrap { overflow-x: auto; }
        .result-table { width: 100%; border-collapse: collapse; min-width: 900px; }
        .result-table th,
        .result-table td { padding: 12px 10px; border-bottom: 1px solid #edf3f7; text-align: left; font-size: 13px; }
        .result-table th { color: #3c7a92; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
        .level-pill {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>

      <div className="result-stack">
        <div className="result-grid">
          <div className="result-stat"><p className="result-label">Total Screening</p><p className="result-value">{stats.total}</p></div>
          <div className="result-stat"><p className="result-label">Rendah</p><p className="result-value">{stats.Rendah}</p></div>
          <div className="result-stat"><p className="result-label">Sedang</p><p className="result-value">{stats.Sedang}</p></div>
          <div className="result-stat"><p className="result-label">Berat</p><p className="result-value">{stats.Berat}</p></div>
        </div>

        <div className="admin-card">
          <div className="result-toolbar" style={{ marginBottom: 12 }}>
            <input
              className="result-input"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, npm, atau email"
            />
            <select
              className="result-select"
              value={levelFilter}
              onChange={(event) => setLevelFilter(event.target.value)}
            >
              <option value="Semua">Semua level</option>
              <option value="Rendah">Rendah</option>
              <option value="Sedang">Sedang</option>
              <option value="Berat">Berat</option>
            </select>
            <button
              type="button"
              className="result-btn"
              onClick={() => downloadCsv(filteredRows)}
              disabled={!filteredRows.length}
            >
              Export CSV
            </button>
          </div>

          {loading ? (
            <div style={{ color: '#6b7f8c' }}>Memuat hasil screening...</div>
          ) : error ? (
            <div style={{ color: '#b91c1c' }}>{error}</div>
          ) : (
            <div className="result-table-wrap">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Nama</th>
                    <th>NPM</th>
                    <th>Email</th>
                    <th>Skor</th>
                    <th>Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ color: '#6b7f8c' }}>Belum ada data hasil screening.</td>
                    </tr>
                  ) : (
                    filteredRows.map((item) => {
                      const style = LEVEL_STYLE[item.level] || LEVEL_STYLE.Rendah;
                      return (
                        <tr key={item.id_hasil}>
                          <td>{formatDate(item.tanggal)}</td>
                          <td>{item.nama}</td>
                          <td>{item.npm || '-'}</td>
                          <td>{item.email || '-'}</td>
                          <td>{item.skor}/{item.total_score || 40}</td>
                          <td>
                            <span className="level-pill" style={{ background: style.bg, color: style.color }}>
                              {item.level}
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

export default Hasil_Screening;

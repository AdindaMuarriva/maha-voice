import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminRecommendations, saveRecommendation } from '../../../services/adminApi';

const LEVELS = ['Rendah', 'Sedang', 'Berat'];

const defaultRecommendation = (level) => ({
  stress_level: level,
  title: level === 'Rendah' ? 'Stres Ringan' : level === 'Sedang' ? 'Stres Sedang' : 'Stres Berat',
  description: '',
  items: level === 'Rendah'
    ? ['Jaga pola tidur 7-8 jam setiap malam', 'Lakukan olahraga ringan setiap hari', 'Luangkan waktu untuk hobi favoritmu', 'Jaga komunikasi dengan orang terdekat']
    : level === 'Sedang'
      ? ['Buat jadwal harian yang realistis', 'Kurangi kafein dan gula berlebih', 'Dengarkan musik relaksasi saat istirahat', 'Cerita ke teman atau orang yang kamu percaya']
      : ['Hubungi konselor atau psikolog', 'Cerita ke orang yang kamu percaya', 'Kurangi beban aktivitas sementara', 'Lakukan latihan napas sederhana'],
  sort_order: LEVELS.indexOf(level) + 1,
  is_active: true,
});

const normalizeRecommendation = (recommendation, level) => {
  if (!recommendation) {
    return defaultRecommendation(level);
  }

  return {
    stress_level: recommendation.stress_level || level,
    title: recommendation.title || defaultRecommendation(level).title,
    description: recommendation.description || '',
    items: Array.isArray(recommendation.items) ? recommendation.items : [],
    sort_order: Number.isFinite(Number(recommendation.sort_order)) ? Number(recommendation.sort_order) : LEVELS.indexOf(level) + 1,
    is_active: recommendation.is_active ?? true,
  };
};

const formatItemsToText = (items) => (Array.isArray(items) ? items.join('\n') : '');

const parseItemsFromText = (value) =>
  String(value || '')
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-•*\s]+/, '').trim())
    .filter(Boolean);

const Rekomendasi = ({ onNavigate }) => {
  const [recommendations, setRecommendations] = useState({
    Rendah: defaultRecommendation('Rendah'),
    Sedang: defaultRecommendation('Sedang'),
    Berat: defaultRecommendation('Berat'),
  });
  const [drafts, setDrafts] = useState({
    Rendah: { ...defaultRecommendation('Rendah'), itemsText: defaultRecommendation('Rendah').items.join('\n') },
    Sedang: { ...defaultRecommendation('Sedang'), itemsText: defaultRecommendation('Sedang').items.join('\n') },
    Berat: { ...defaultRecommendation('Berat'), itemsText: defaultRecommendation('Berat').items.join('\n') },
  });
  const [savingLevel, setSavingLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await getAdminRecommendations();
        const normalized = LEVELS.reduce((acc, level) => {
          const found = Array.isArray(result.recommendations)
            ? result.recommendations.find((item) => item.stress_level === level)
            : null;

          const recommendation = normalizeRecommendation(found, level);
          acc[level] = recommendation;
          return acc;
        }, {});

        setRecommendations(normalized);
        setDrafts(LEVELS.reduce((acc, level) => {
          const item = normalized[level] || defaultRecommendation(level);
          acc[level] = { ...item, itemsText: formatItemsToText(item.items) };
          return acc;
        }, {}));
      } catch (err) {
        setError(err?.message || 'Gagal memuat rekomendasi.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const stats = useMemo(() => {
    const activeCount = Object.values(recommendations).filter((item) => item.is_active).length;

    return {
      total: Object.keys(recommendations).length,
      active: activeCount,
      inactive: Object.keys(recommendations).length - activeCount,
    };
  }, [recommendations]);

  const updateDraft = (level, field, value) => {
    setDrafts((previous) => ({
      ...previous,
      [level]: {
        ...(previous[level] || defaultRecommendation(level)),
        [field]: value,
      },
    }));
  };

  const handleSave = async (level) => {
    const draft = drafts[level];

    if (!draft?.title.trim()) {
      setError(`Judul rekomendasi ${level} wajib diisi.`);
      return;
    }

    const items = parseItemsFromText(draft.itemsText);

    if (!items.length) {
      setError(`Minimal satu poin rekomendasi ${level} harus diisi.`);
      return;
    }

    try {
      setSavingLevel(level);
      setError('');
      const result = await saveRecommendation(level, {
        title: draft.title,
        description: draft.description,
        items,
        sort_order: draft.sort_order,
        is_active: draft.is_active,
      });

      const updated = normalizeRecommendation(result?.recommendation || draft, level);
      setRecommendations((previous) => ({
        ...previous,
        [level]: updated,
      }));
      setDrafts((previous) => ({
        ...previous,
        [level]: {
          ...updated,
          itemsText: formatItemsToText(updated.items),
        },
      }));
      setMessage(`Rekomendasi ${level} berhasil disimpan.`);
    } catch (err) {
      setError(err.message || `Gagal menyimpan rekomendasi ${level}`);
    } finally {
      setSavingLevel('');
    }
  };

  const badgeStyle = (level) => {
    if (level === 'Rendah') return { bg: '#D6EEF8', color: '#3A8FB5' };
    if (level === 'Sedang') return { bg: '#FAFAD2', color: '#B08900' };
    return { bg: '#FDDCDC', color: '#E05C5C' };
  };

  return (
    <AdminLayout
      activePage="recommendation"
      title="Rekomendasi"
      subtitle="Kelola saran yang tampil di halaman hasil screening berdasarkan level stres mahasiswa."
      onNavigate={onNavigate}
    >
      <style>{`
        .rec-stack { display: grid; gap: 16px; }
        .rec-top {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .rec-stat {
          background: rgba(255,255,255,0.96);
          border: 1px solid #dbe8ef;
          border-radius: 18px;
          padding: 14px;
          box-shadow: 0 12px 30px rgba(24, 48, 65, 0.04);
        }
        .rec-label { margin: 0 0 6px; color: #6b7f8c; font-size: 12px; font-weight: 700; }
        .rec-value { margin: 0; color: #183041; font-size: 24px; font-weight: 800; }
        .rec-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }
        .rec-card {
          background: rgba(255,255,255,0.96);
          border: 1px solid #dbe8ef;
          border-radius: 20px;
          padding: 16px;
          box-shadow: 0 14px 40px rgba(24, 48, 65, 0.06);
        }
        .rec-card-head { display: flex; justify-content: space-between; gap: 10px; align-items: center; margin-bottom: 12px; }
        .rec-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }
        .rec-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
        .rec-field label { font-size: 12px; font-weight: 700; color: #3c7a92; }
        .rec-field input, .rec-field textarea, .rec-field select {
          width: 100%;
          border: 1px solid #dbe8ef;
          border-radius: 14px;
          padding: 11px 12px;
          font-family: inherit;
          font-size: 13px;
          background: #fff;
          color: #183041;
        }
        .rec-field textarea { min-height: 120px; resize: vertical; }
        .rec-btn {
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
        .rec-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
        .rec-list { margin: 0; padding-left: 18px; color: #1e293b; font-size: 13px; line-height: 1.7; }
        .rec-list li { margin-bottom: 6px; }
        .rec-help { font-size: 12px; color: #6b7f8c; line-height: 1.6; margin: 8px 0 0; }
        .rec-feedback { padding: 12px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; }
        .rec-feedback.error { background: #fff1f2; color: #b91c1c; }
        .rec-feedback.success { background: #ecfeff; color: #0f766e; }
        @media (max-width: 1100px) {
          .rec-grid, .rec-top { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rec-stack">
        <div className="rec-top">
          <div className="rec-stat">
            <p className="rec-label">Total Level</p>
            <p className="rec-value">{stats.total}</p>
          </div>
          <div className="rec-stat">
            <p className="rec-label">Aktif</p>
            <p className="rec-value">{stats.active}</p>
          </div>
          <div className="rec-stat">
            <p className="rec-label">Nonaktif</p>
            <p className="rec-value">{stats.inactive}</p>
          </div>
        </div>

        {loading && <div className="rec-feedback">Memuat rekomendasi...</div>}
        {error && !loading && <div className="rec-feedback error">{error}</div>}
        {message && !loading && !error && <div className="rec-feedback success">{message}</div>}

        <div className="rec-grid">
          {LEVELS.map((level) => {
            const draft = drafts[level];
            const styles = badgeStyle(level);

            return (
              <article key={level} className="rec-card">
                <div className="rec-card-head">
                  <span className="rec-badge" style={{ background: styles.bg, color: styles.color }}>
                    {draft.title}
                  </span>
                  <span style={{ fontSize: 12, color: '#6b7f8c', fontWeight: 700 }}>Level {level}</span>
                </div>

                <div className="rec-field">
                  <label>Judul Kartu</label>
                  <input
                    value={draft.title}
                    onChange={(event) => updateDraft(level, 'title', event.target.value)}
                    placeholder="Contoh: Stres Ringan"
                  />
                </div>

                <div className="rec-field">
                  <label>Deskripsi Singkat</label>
                  <textarea
                    value={draft.description}
                    onChange={(event) => updateDraft(level, 'description', event.target.value)}
                    placeholder="Deskripsi singkat yang tampil di bawah judul"
                  />
                </div>

                <div className="rec-field">
                  <label>Daftar Saran</label>
                  <textarea
                    value={draft.itemsText}
                    onChange={(event) => updateDraft(level, 'itemsText', event.target.value)}
                    placeholder={'Tulis satu saran per baris.\nContoh:\nJaga pola tidur 7-8 jam setiap malam\nLakukan olahraga ringan setiap hari'}
                  />
                  <p className="rec-help">Satu baris = satu poin saran. Tanda minus atau bullet akan dibersihkan otomatis saat disimpan.</p>
                </div>

                <div className="rec-field">
                  <label>Urutan Tampil</label>
                  <select
                    value={draft.sort_order}
                    onChange={(event) => updateDraft(level, 'sort_order', Number(event.target.value))}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>

                <div className="rec-field">
                  <label>Status</label>
                  <select
                    value={draft.is_active ? 'active' : 'inactive'}
                    onChange={(event) => updateDraft(level, 'is_active', event.target.value === 'active')}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>

                <div className="rec-field">
                  <label>Preview</label>
                  <ul className="rec-list">
                    {(draft.itemsText ? parseItemsFromText(draft.itemsText) : recommendations[level]?.items || []).slice(0, 4).map((item, index) => (
                      <li key={`${level}-${index}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  className="rec-btn"
                  disabled={savingLevel === level}
                  onClick={() => handleSave(level)}
                >
                  {savingLevel === level ? 'Menyimpan...' : 'Simpan Rekomendasi'}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Rekomendasi;

import { useEffect, useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import {
  createScreeningQuestion,
  deleteScreeningQuestion,
  getAdminScreeningQuestions,
  updateScreeningQuestion,
} from '../../../services/adminApi';

const blankQuestion = {
  question_text: '',
  weight: 1,
  sort_order: 1,
  is_active: true,
};

const normalizeQuestion = (question, index = 0) => ({
  id_question: question.id_question,
  question_text: question.question_text || '',
  weight: Math.min(Math.max(Number(question.weight) || 1, 1), 4),
  sort_order: Number.isFinite(Number(question.sort_order)) ? Number(question.sort_order) : index + 1,
  is_active: question.is_active ?? true,
});

const buildWeightLabel = (weight) => {
  const numericWeight = Math.min(Math.max(Number(weight) || 1, 1), 4);
  return `Bobot ${numericWeight}`;
};

const Pertanyaan_Screening = ({ onNavigate }) => {
  const [questions, setQuestions] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [newQuestion, setNewQuestion] = useState(blankQuestion);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const result = await getAdminScreeningQuestions();
        const data = Array.isArray(result?.questions) ? result.questions : [];

        if (!active) {
          return;
        }

        const normalized = data.map((question, index) => normalizeQuestion(question, index));
        setQuestions(normalized);
        setDrafts(normalized.reduce((accumulator, question) => ({
          ...accumulator,
          [question.id_question]: question,
        }), {}));
        setError('');
      } catch (err) {
        if (active) {
          setError(err.message || 'Gagal memuat pertanyaan screening');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadQuestions();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const activeCount = questions.filter((question) => question.is_active).length;
    const inactiveCount = questions.length - activeCount;

    return {
      total: questions.length,
      active: activeCount,
      inactive: inactiveCount,
      maxWeight: questions.length ? Math.max(...questions.map((question) => Number(question.weight) || 1)) : 0,
    };
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return questions;
    }

    return questions.filter((question) =>
      question.question_text.toLowerCase().includes(term) ||
      String(question.weight).includes(term) ||
      String(question.sort_order).includes(term),
    );
  }, [questions, search]);

  const handleDraftChange = (id, field, value) => {
    setDrafts((previous) => ({
      ...previous,
      [id]: {
        ...(previous[id] || {}),
        [field]: value,
      },
    }));
  };

  const handleNewQuestionChange = (field, value) => {
    setNewQuestion((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleCreate = async () => {
    const questionText = String(newQuestion.question_text || '').trim();

    if (!questionText) {
      setError('Pertanyaan baru wajib diisi.');
      return;
    }

    try {
      setSavingId('new');
      setError('');
      const result = await createScreeningQuestion({
        question_text: questionText,
        weight: Number(newQuestion.weight) || 1,
        sort_order: Number(newQuestion.sort_order) || questions.length + 1,
        is_active: Boolean(newQuestion.is_active),
      });

      const created = normalizeQuestion(result.question, questions.length);
      setQuestions((previous) => [...previous, created]);
      setDrafts((previous) => ({ ...previous, [created.id_question]: created }));
      setNewQuestion(blankQuestion);
      setMessage('Pertanyaan baru berhasil disimpan.');
    } catch (err) {
      setError(err.message || 'Gagal membuat pertanyaan baru');
    } finally {
      setSavingId('');
    }
  };

  const handleSave = async (id) => {
    const draft = drafts[id];
    if (!draft || !String(draft.question_text || '').trim()) {
      setError('Pertanyaan tidak boleh kosong.');
      return;
    }

    try {
      setSavingId(id);
      setError('');
      const result = await updateScreeningQuestion(id, {
        question_text: String(draft.question_text || '').trim(),
        weight: Number(draft.weight) || 1,
        sort_order: Number(draft.sort_order) || 1,
        is_active: Boolean(draft.is_active),
      });

      const updated = normalizeQuestion(result.question);
      setQuestions((previous) => previous.map((question) => (question.id_question === id ? updated : question)));
      setDrafts((previous) => ({ ...previous, [id]: updated }));
      setMessage('Pertanyaan berhasil diperbarui.');
    } catch (err) {
      setError(err.message || 'Gagal memperbarui pertanyaan');
    } finally {
      setSavingId('');
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Hapus pertanyaan ini?');
    if (!confirmDelete) {
      return;
    }

    try {
      setSavingId(id);
      setError('');
      await deleteScreeningQuestion(id);
      setQuestions((previous) => previous.filter((question) => question.id_question !== id));
      setDrafts((previous) => {
        const nextDrafts = { ...previous };
        delete nextDrafts[id];
        return nextDrafts;
      });
      setMessage('Pertanyaan berhasil dihapus.');
    } catch (err) {
      setError(err.message || 'Gagal menghapus pertanyaan');
    } finally {
      setSavingId('');
    }
  };

  return (
    <AdminLayout
      activePage="questions"
      title="Pertanyaan Screening"
      subtitle="Kelola bank pertanyaan screening, bobot 1-4, urutan tampil, dan status aktif."
      onNavigate={onNavigate}
    >
      <style>{`
        .qs-stack { display: grid; gap: 16px; }
        .qs-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 16px;
        }
        .qs-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 22px;
          padding: 18px 20px;
          box-shadow: 0 14px 40px rgba(24, 48, 65, 0.06);
          border: 1px solid rgba(219, 232, 239, 0.9);
        }
        .qs-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
        }
        .qs-stat {
          background: linear-gradient(180deg, #ffffff 0%, #f7fbfe 100%);
          border-radius: 18px;
          padding: 14px;
          border: 1px solid #dbe8ef;
        }
        .qs-stat-label { margin: 0 0 6px; color: #6b7f8c; font-size: 12px; font-weight: 700; }
        .qs-stat-value { margin: 0; color: #183041; font-size: 26px; font-weight: 800; letter-spacing: -0.4px; }
        .qs-search-row {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .qs-search {
          flex: 1;
          min-width: 220px;
          border: 1px solid #dbe8ef;
          border-radius: 999px;
          padding: 12px 16px;
          font-family: inherit;
          font-size: 13px;
          background: #fff;
          color: #183041;
        }
        .qs-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-radius: 999px;
          background: #f7fbfe;
          border: 1px solid #dbe8ef;
          color: #3c7a92;
          font-size: 12px;
          font-weight: 700;
        }
        .qs-form {
          display: grid;
          grid-template-columns: 1fr 120px 120px 120px auto;
          gap: 12px;
          align-items: end;
        }
        .qs-field { display: flex; flex-direction: column; gap: 6px; }
        .qs-field label { font-size: 12px; font-weight: 700; color: #3c7a92; }
        .qs-field input, .qs-field textarea, .qs-field select {
          width: 100%;
          border: 1px solid #dbe8ef;
          border-radius: 14px;
          padding: 12px 14px;
          font-family: inherit;
          font-size: 13px;
          background: #ffffff;
          color: #183041;
        }
        .qs-field textarea { min-height: 96px; resize: vertical; }
        .qs-btn {
          border: none;
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 700;
          cursor: pointer;
          font-size: 13px;
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }
        .qs-btn:hover { transform: translateY(-1px); }
        .qs-btn.primary { background: linear-gradient(135deg, #3c7a92 0%, #2b657a 100%); color: #fff; box-shadow: 0 10px 24px rgba(60,122,146,0.22); }
        .qs-btn.secondary { background: #eaf4f7; color: #1b5a72; }
        .qs-btn.danger { background: #fee2e2; color: #b91c1c; }
        .qs-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .qs-table-wrap { overflow-x: auto; }
        .qs-table { width: 100%; border-collapse: collapse; min-width: 980px; }
        .qs-table th, .qs-table td { padding: 14px 10px; border-bottom: 1px solid #edf3f7; vertical-align: top; }
        .qs-table th { text-align: left; color: #3c7a92; font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; }
        .qs-inline, .qs-inline-select {
          width: 100%;
          border: 1px solid #dbe8ef;
          border-radius: 12px;
          padding: 10px 12px;
          font-family: inherit;
          font-size: 13px;
          background: #fff;
          color: #183041;
        }
        .qs-inline-textarea { min-height: 90px; resize: vertical; }
        .qs-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }
        .qs-status.active { background: #dcfce7; color: #166534; }
        .qs-status.inactive { background: #f3f4f6; color: #6b7280; }
        .qs-mono { font-variant-numeric: tabular-nums; }
        .qs-feedback { padding: 12px 14px; border-radius: 16px; background: #f7fbfe; color: #6b7f8c; font-size: 13px; line-height: 1.5; }
        .qs-feedback.error { background: #fff1f2; color: #b91c1c; }
        .qs-feedback.success { background: #ecfeff; color: #0f766e; }
        @media (max-width: 1100px) {
          .qs-hero { grid-template-columns: 1fr; }
          .qs-stat-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .qs-form { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="qs-stack">
        <div className="qs-hero">
          <div className="qs-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div className="qs-chip">Panel CRUD Pertanyaan</div>
                <h2 style={{ margin: '12px 0 8px', color: '#183041', fontSize: 22, fontWeight: 800 }}>Bank Pertanyaan Screening</h2>
                <p className="question-note">Gunakan panel ini untuk menambah, mengubah, menonaktifkan, dan menghapus pertanyaan screening dengan bobot 1 sampai 4.</p>
              </div>
              <div className="qs-chip">Bobot valid: 1 - 4</div>
            </div>

            <div className="qs-stat-grid">
              <div className="qs-stat"><p className="qs-stat-label">Total Pertanyaan</p><p className="qs-stat-value qs-mono">{stats.total}</p></div>
              <div className="qs-stat"><p className="qs-stat-label">Aktif</p><p className="qs-stat-value qs-mono">{stats.active}</p></div>
              <div className="qs-stat"><p className="qs-stat-label">Nonaktif</p><p className="qs-stat-value qs-mono">{stats.inactive}</p></div>
              <div className="qs-stat"><p className="qs-stat-label">Bobot Tertinggi</p><p className="qs-stat-value qs-mono">{stats.maxWeight || '-'}</p></div>
            </div>
          </div>

          <div className="qs-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 10 }}>
              <div>
                <h3 style={{ margin: 0, color: '#183041', fontSize: 18, fontWeight: 800 }}>Tambah Pertanyaan</h3>
                <p className="question-note">Langsung simpan pertanyaan baru beserta bobot, urutan, dan status aktifnya.</p>
              </div>
            </div>

            <div className="qs-form">
              <div className="qs-field" style={{ gridColumn: '1 / -1' }}>
                <label>Pertanyaan</label>
                <textarea
                  className="qs-inline qs-inline-textarea"
                  value={newQuestion.question_text}
                  onChange={(event) => handleNewQuestionChange('question_text', event.target.value)}
                  placeholder="Tulis pertanyaan screening di sini"
                />
              </div>
              <div className="qs-field">
                <label>Bobot</label>
                <select className="qs-inline-select" value={newQuestion.weight} onChange={(event) => handleNewQuestionChange('weight', event.target.value)}>
                  {[1, 2, 3, 4].map((weight) => <option key={weight} value={weight}>{weight}</option>)}
                </select>
              </div>
              <div className="qs-field">
                <label>Urutan</label>
                <input className="qs-inline" type="number" min="1" value={newQuestion.sort_order} onChange={(event) => handleNewQuestionChange('sort_order', event.target.value)} />
              </div>
              <div className="qs-field">
                <label>Status</label>
                <select className="qs-inline-select" value={newQuestion.is_active ? 'true' : 'false'} onChange={(event) => handleNewQuestionChange('is_active', event.target.value === 'true')}>
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
              <button className="qs-btn primary" type="button" onClick={handleCreate} disabled={savingId === 'new'}>
                {savingId === 'new' ? 'Menyimpan...' : 'Tambah Pertanyaan'}
              </button>
            </div>
          </div>
        </div>

        <div className="qs-card">
          <div className="qs-search-row" style={{ marginBottom: 14 }}>
            <div>
              <h3 style={{ margin: 0, color: '#183041', fontSize: 18, fontWeight: 800 }}>Daftar Pertanyaan</h3>
              <p className="question-note">Edit langsung pada tabel. Simpan perubahan per baris agar lebih aman dan terkontrol.</p>
            </div>
            <input
              className="qs-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari pertanyaan, bobot, atau urutan..."
            />
          </div>

          {loading && <div className="qs-feedback">Memuat pertanyaan dari database...</div>}
          {error && !loading && <div className="qs-feedback error">{error}</div>}
          {message && !error && <div className="qs-feedback success">{message}</div>}

          {!loading && !error && filteredQuestions.length === 0 && (
            <div className="qs-feedback">Belum ada pertanyaan yang cocok dengan pencarian ini.</div>
          )}

          {!loading && filteredQuestions.length > 0 && (
            <div className="qs-table-wrap">
              <table className="qs-table">
                <thead>
                  <tr>
                    <th style={{ width: 60 }}>No</th>
                    <th>Pertanyaan</th>
                    <th style={{ width: 120 }}>Bobot</th>
                    <th style={{ width: 110 }}>Urutan</th>
                    <th style={{ width: 120 }}>Status</th>
                    <th style={{ width: 180 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuestions.map((question, index) => {
                    const draft = drafts[question.id_question] || question;

                    return (
                      <tr key={question.id_question}>
                        <td className="qs-mono">{index + 1}</td>
                        <td>
                          <textarea
                            className="qs-inline qs-inline-textarea"
                            value={draft.question_text}
                            onChange={(event) => handleDraftChange(question.id_question, 'question_text', event.target.value)}
                            rows={3}
                          />
                        </td>
                        <td>
                          <select
                            className="qs-inline-select"
                            value={draft.weight}
                            onChange={(event) => handleDraftChange(question.id_question, 'weight', event.target.value)}
                          >
                            {[1, 2, 3, 4].map((weight) => <option key={weight} value={weight}>{buildWeightLabel(weight)}</option>)}
                          </select>
                        </td>
                        <td>
                          <input
                            className="qs-inline qs-mono"
                            type="number"
                            min="1"
                            value={draft.sort_order}
                            onChange={(event) => handleDraftChange(question.id_question, 'sort_order', event.target.value)}
                          />
                        </td>
                        <td>
                          <label className={`qs-status ${draft.is_active ? 'active' : 'inactive'}`}>
                            <input
                              type="checkbox"
                              checked={Boolean(draft.is_active)}
                              onChange={(event) => handleDraftChange(question.id_question, 'is_active', event.target.checked)}
                            />
                            {draft.is_active ? 'Aktif' : 'Nonaktif'}
                          </label>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="qs-btn primary"
                              onClick={() => handleSave(question.id_question)}
                              disabled={savingId === question.id_question}
                            >
                              {savingId === question.id_question ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                              type="button"
                              className="qs-btn danger"
                              onClick={() => handleDelete(question.id_question)}
                              disabled={savingId === question.id_question}
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Pertanyaan_Screening;

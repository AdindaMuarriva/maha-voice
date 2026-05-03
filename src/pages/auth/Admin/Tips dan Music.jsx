import { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getAdminMusik, createMusik, updateMusik, deleteMusik } from '../../../services/musikApi';
import { getAdminTips, createTip, updateTip, deleteTip } from '../../../services/tipsApi';

const TipsAndMusic = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('musik'); // 'musik' or 'tips'

  // Musik states
  const [musikList, setMusikList] = useState([]);
  const [musikLoading, setMusikLoading] = useState(true);
  const [musikError, setMusikError] = useState(null);
  const [musikShowModal, setMusikShowModal] = useState(false);
  const [musikEditingId, setMusikEditingId] = useState(null);
  const [musikFormData, setMusikFormData] = useState({
    title: '',
    category: '',
    channel: '',
    youtube_id: '',
    thumbnail_url: '',
    sort_order: 0,
  });

  // Tips states
  const [tipsList, setTipsList] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);
  const [tipsError, setTipsError] = useState(null);
  const [tipsShowModal, setTipsShowModal] = useState(false);
  const [tipsEditingId, setTipsEditingId] = useState(null);
  const [tipsFormData, setTipsFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    sort_order: 0,
  });

  // Fetch musik list
  useEffect(() => {
    fetchMusikList();
    fetchTipsList();
  }, []);

  // ─────────────────────────────────────────────
  // MUSIK FUNCTIONS
  // ─────────────────────────────────────────────
  const fetchMusikList = async () => {
    try {
      setMusikLoading(true);
      const result = await getAdminMusik();
      if (result.success) {
        setMusikList(Array.isArray(result.data) ? result.data : []);
        setMusikError(null);
      }
    } catch (err) {
      setMusikError(err.message || 'Gagal memuat data musik');
    } finally {
      setMusikLoading(false);
    }
  };

  const handleOpenMusikModal = (musik = null) => {
    if (musik) {
      setMusikEditingId(musik.id_musik);
      setMusikFormData({
        title: musik.title,
        category: musik.category,
        channel: musik.channel || '',
        youtube_id: musik.youtube_id || '',
        thumbnail_url: musik.thumbnail_url || '',
        sort_order: musik.sort_order || 0,
      });
    } else {
      setMusikEditingId(null);
      setMusikFormData({
        title: '',
        category: '',
        channel: '',
        youtube_id: '',
        thumbnail_url: '',
        sort_order: 0,
      });
    }
    setMusikShowModal(true);
  };

  const handleCloseMusikModal = () => {
    setMusikShowModal(false);
    setMusikEditingId(null);
    setMusikFormData({
      title: '',
      category: '',
      channel: '',
      youtube_id: '',
      thumbnail_url: '',
      sort_order: 0,
    });
  };

  const handleMusikInputChange = (e) => {
    const { name, value } = e.target;
    setMusikFormData(prev => ({
      ...prev,
      [name]: name === 'sort_order' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSaveMusik = async () => {
    if (!musikFormData.title || !musikFormData.category || !musikFormData.youtube_id) {
      alert('Judul, kategori, dan YouTube ID harus diisi');
      return;
    }

    try {
      if (musikEditingId) {
        await updateMusik(musikEditingId, musikFormData);
        alert('Musik berhasil diperbarui');
      } else {
        await createMusik(musikFormData);
        alert('Musik berhasil ditambahkan');
      }
      handleCloseMusikModal();
      await fetchMusikList();
    } catch (err) {
      alert('Error: ' + (err.message || 'Gagal menyimpan musik'));
    }
  };

  const handleDeleteMusik = async (id) => {
    if (window.confirm('Yakin ingin menghapus musik ini?')) {
      try {
        await deleteMusik(id);
        alert('Musik berhasil dihapus');
        await fetchMusikList();
      } catch (err) {
        alert('Error: ' + (err.message || 'Gagal menghapus musik'));
      }
    }
  };

  // ─────────────────────────────────────────────
  // TIPS FUNCTIONS
  // ─────────────────────────────────────────────
  const fetchTipsList = async () => {
    try {
      setTipsLoading(true);
      const result = await getAdminTips();
      if (result.success) {
        setTipsList(Array.isArray(result.data) ? result.data : []);
        setTipsError(null);
      }
    } catch (err) {
      setTipsError(err.message || 'Gagal memuat data tips');
    } finally {
      setTipsLoading(false);
    }
  };

  const handleOpenTipsModal = (tip = null) => {
    if (tip) {
      setTipsEditingId(tip.id_tips);
      setTipsFormData({
        title: tip.title,
        description: tip.description || '',
        content: tip.content || '',
        category: tip.category,
        sort_order: tip.sort_order || 0,
      });
    } else {
      setTipsEditingId(null);
      setTipsFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        sort_order: 0,
      });
    }
    setTipsShowModal(true);
  };

  const handleCloseTipsModal = () => {
    setTipsShowModal(false);
    setTipsEditingId(null);
    setTipsFormData({
      title: '',
      description: '',
      category: '',
      sort_order: 0,
    });
  };

  const handleTipsInputChange = (e) => {
    const { name, value } = e.target;
    setTipsFormData(prev => ({
      ...prev,
      [name]: name === 'sort_order' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSaveTip = async () => {
    if (!tipsFormData.title || !tipsFormData.category) {
      alert('Judul dan kategori harus diisi');
      return;
    }

    try {
      if (tipsEditingId) {
        await updateTip(tipsEditingId, tipsFormData);
        alert('Tips berhasil diperbarui');
      } else {
        await createTip(tipsFormData);
        alert('Tips berhasil ditambahkan');
      }
      handleCloseTipsModal();
      await fetchTipsList();
    } catch (err) {
      alert('Error: ' + (err.message || 'Gagal menyimpan tips'));
    }
  };

  const handleDeleteTip = async (id) => {
    if (window.confirm('Yakin ingin menghapus tips ini?')) {
      try {
        await deleteTip(id);
        alert('Tips berhasil dihapus');
        await fetchTipsList();
      } catch (err) {
        alert('Error: ' + (err.message || 'Gagal menghapus tips'));
      }
    }
  };

  return (
    <AdminLayout
      activePage="tips"
      title="Tips & Musik"
      subtitle="Kelola musik pereda stres dan tips untuk mahasiswa."
      onNavigate={onNavigate}
    >
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('musik')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'musik' ? '#088395' : '#e2e8f0',
            color: activeTab === 'musik' ? 'white' : '#088395',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
        >
          🎵 Daftar Musik
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          style={{
            padding: '12px 24px',
            backgroundColor: activeTab === 'tips' ? '#088395' : '#e2e8f0',
            color: activeTab === 'tips' ? 'white' : '#088395',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
        >
          💡 Daftar Tips
        </button>
      </div>

      {/* MUSIK TAB */}
      {activeTab === 'musik' && (
        <div className="admin-card">
        {/* Header dengan Tombol Tambah */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#088395' }}>
            Daftar Musik
          </h3>
          <button
            onClick={() => handleOpenMusikModal()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#088395',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            + Tambah Musik
          </button>
        </div>

          {/* Loading State */}
          {musikLoading && <p style={{ color: '#6b7f8c' }}>Memuat data...</p>}

          {/* Error State */}
          {musikError && <p style={{ color: '#dc2626' }}>Error: {musikError}</p>}

          {/* Musik List */}
          {!musikLoading && !musikError && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Judul</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Kategori</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Channel</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>YouTube ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {musikList.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#6b7f8c' }}>
                      Belum ada musik. Klik "Tambah Musik" untuk menambahkan.
                    </td>
                  </tr>
                ) : (
                  musikList.map(musik => (
                    <tr key={musik.id_musik} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: musik.is_active ? '#fff' : '#f8fafc' }}>
                      <td style={{ padding: '12px', color: '#6b7f8c' }}>{musik.id_musik}</td>
                      <td style={{ padding: '12px', color: '#088395', fontWeight: '500' }}>{musik.title}</td>
                      <td style={{ padding: '12px', color: '#6b7f8c' }}>{musik.category}</td>
                      <td style={{ padding: '12px', color: '#6b7f8c' }}>{musik.channel}</td>
                      <td style={{ padding: '12px', color: '#6b7f8c', fontSize: '12px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {musik.youtube_id}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleOpenMusikModal(musik)}
                          style={{
                            padding: '6px 12px',
                            marginRight: '8px',
                            backgroundColor: '#4b9bb5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMusik(musik.id_musik)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        </div>
      )}

      {/* TIPS TAB */}
      {activeTab === 'tips' && (
        <div className="admin-card">
          {/* Header dengan Tombol Tambah */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#088395' }}>
              Daftar Tips & Saran
            </h3>
            <button
              onClick={() => handleOpenTipsModal()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#088395',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              + Tambah Tips
            </button>
          </div>

          {/* Loading State */}
          {tipsLoading && <p style={{ color: '#6b7f8c' }}>Memuat data...</p>}

          {/* Error State */}
          {tipsError && <p style={{ color: '#dc2626' }}>Error: {tipsError}</p>}

          {/* Tips List */}
          {!tipsLoading && !tipsError && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Judul</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Kategori</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Deskripsi</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#088395' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {tipsList.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#6b7f8c' }}>
                        Belum ada tips. Klik "Tambah Tips" untuk menambahkan.
                      </td>
                    </tr>
                  ) : (
                    tipsList.map(tip => (
                      <tr key={tip.id_tips} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: tip.is_active ? '#fff' : '#f8fafc' }}>
                        <td style={{ padding: '12px', color: '#6b7f8c' }}>{tip.id_tips}</td>
                        <td style={{ padding: '12px', color: '#088395', fontWeight: '500' }}>{tip.title}</td>
                        <td style={{ padding: '12px', color: '#6b7f8c' }}>{tip.category}</td>
                        <td style={{ padding: '12px', color: '#6b7f8c', fontSize: '12px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tip.description}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button
                            onClick={() => handleOpenTipsModal(tip)}
                            style={{
                              padding: '6px 12px',
                              marginRight: '8px',
                              backgroundColor: '#4b9bb5',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTip(tip.id_tips)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {musikShowModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: '#088395' }}>
              {musikEditingId ? 'Edit Musik' : 'Tambah Musik Baru'}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Judul Musik *
              </label>
              <input
                type="text"
                name="title"
                value={musikFormData.title}
                onChange={handleMusikInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Kategori *
              </label>
              <select
                name="category"
                value={musikFormData.category}
                onChange={handleMusikInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Relaksasi">Relaksasi</option>
                <option value="Fokus Belajar">Fokus Belajar</option>
                <option value="Tidur Sehat">Tidur Sehat</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Channel / Artis
              </label>
              <input
                type="text"
                name="channel"
                value={musikFormData.channel}
                onChange={handleMusikInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                YouTube ID *
              </label>
              <input
                type="text"
                name="youtube_id"
                value={musikFormData.youtube_id}
                onChange={handleMusikInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="e.g., dQw4w9WgXcQ"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Thumbnail URL
              </label>
              <input
                type="text"
                name="thumbnail_url"
                value={musikFormData.thumbnail_url}
                onChange={handleMusikInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                placeholder="https://..."
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Urutan Tampil
              </label>
              <input
                type="number"
                name="sort_order"
                value={musikFormData.sort_order}
                onChange={handleMusikInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseMusikModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#cbd5e1',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSaveMusik}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#088395',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TIPS MODAL */}
      {tipsShowModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: '#088395' }}>
              {tipsEditingId ? 'Edit Tips' : 'Tambah Tips Baru'}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Judul Tips *
              </label>
              <input
                type="text"
                name="title"
                value={tipsFormData.title}
                onChange={handleTipsInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Kategori *
              </label>
              <select
                name="category"
                value={tipsFormData.category}
                onChange={handleTipsInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Relaksasi">Relaksasi</option>
                <option value="Fokus Belajar">Fokus Belajar</option>
                <option value="Tidur Sehat">Tidur Sehat</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Deskripsi singkat
              </label>
              <textarea
                name="description"
                value={tipsFormData.description}
                onChange={handleTipsInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  fontFamily: 'inherit',
                }}
                placeholder="Ringkas isi tips..."
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Isi artikel / detail saran
              </label>
              <textarea
                name="content"
                value={tipsFormData.content}
                onChange={handleTipsInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '140px',
                  fontFamily: 'inherit',
                }}
                placeholder="Tulis isi artikel lengkap di sini..."
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#6b7f8c' }}>
                Urutan Tampil
              </label>
              <input
                type="number"
                name="sort_order"
                value={tipsFormData.sort_order}
                onChange={handleTipsInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCloseTipsModal}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#cbd5e1',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Batal
              </button>
              <button
                onClick={handleSaveTip}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#088395',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TipsAndMusic;

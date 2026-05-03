import { useState } from 'react';
import bgRiwayat from '../../assets/bgriwayat.png';
import { updateProfile } from '../../services/authApi';

const EditProfil = ({ currentUser, onBack, onProfileUpdated }) => {
  const [form, setForm] = useState({
    nama: currentUser?.nama || '',
    npm: currentUser?.npm || '',
    email: currentUser?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErr('');
    setMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setIsLoading(true);
    try {
      const userId = currentUser?.id_user || currentUser?.id || currentUser?.userId || null;
      const res = await updateProfile(userId, form);
      setMsg(res.message || 'Profil berhasil diperbarui');
      onProfileUpdated?.(res.user || form);
    } catch (error) {
      setErr(error.message || 'Gagal memperbarui profil');
    }
    setIsLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .ep-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box }
        .ep-back { max-width:460px; margin:0 auto 12px; }
        .rw-back-btn { background:none; border:none; cursor:pointer; color:#07586a; font-size:13px; font-weight:600; padding:0 }
        .ep-card { width:100%; max-width:460px; margin:10px auto; background: linear-gradient(180deg, rgba(221,245,255,0.9), rgba(215,236,247,0.9)); border-radius:16px; padding:18px }
        .ep-input { width:100%; padding:12px 14px; border-radius:12px; border:none; background:#f1f9ff; font-size:14px }
        .ep-btn { width:100%; padding:12px 14px; border-radius:12px; border:none; background:#07586a; color:#fff; font-weight:700; cursor:pointer }
        .ep-root { min-height:100vh; padding:24px 18px 36px; background: linear-gradient(180deg, rgba(234,248,255,0.6), rgba(243,251,255,0.6)), url(${bgRiwayat}); background-size:cover; background-position:center }
      `}</style>

      <div className="ep-root">
        <div className="ep-back">
          {onBack ? <button className="rw-back-btn" onClick={onBack}>‹ Kembali</button> : null}
        </div>

        <div style={{ maxWidth:460, margin:'8px auto' }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:800, color:'#0f172a' }}>Edit Profil</h1>
          <p style={{ marginTop:6, color:'#17566f' }}>Ubah data dan informasi akun</p>
        </div>

        <form onSubmit={handleSubmit} className="ep-card">
          <div style={{ display:'grid', gap:10 }}>
            <label style={{ fontSize:13, fontWeight:700 }}>Nama Lengkap</label>
            <input className="ep-input" name="nama" value={form.nama} onChange={handleChange} />

            <label style={{ fontSize:13, fontWeight:700 }}>NPM</label>
            <input className="ep-input" name="npm" value={form.npm} onChange={handleChange} />

            <label style={{ fontSize:13, fontWeight:700 }}>Email</label>
            <input className="ep-input" name="email" value={form.email} onChange={handleChange} />

            <button type="submit" className="ep-btn" style={{ marginTop:6 }}>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>

            {msg && <p style={{ color:'#064e3b', fontWeight:700 }}>{msg}</p>}
            {err && <p style={{ color:'#b91c1c', fontWeight:700 }}>{err}</p>}
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProfil;

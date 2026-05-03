import { useState } from 'react';
import bgRiwayat from '../../assets/bgriwayat.png';
import { changePassword } from '../../services/authApi';

const GantiPassword = ({ currentUser, onBack, onPasswordChanged }) => {
	const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
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
		setErr(''); setMsg('');
		if (!form.newPassword || form.newPassword.length < 8) { setErr('Password baru minimal 8 karakter'); return; }
		if (form.newPassword !== form.confirm) { setErr('Konfirmasi password tidak cocok'); return; }
		setIsLoading(true);
		try {
			const userId = currentUser?.id_user || currentUser?.id || currentUser?.userId || null;
			const res = await changePassword(userId, { currentPassword: form.currentPassword, newPassword: form.newPassword });
			setMsg(res.message || 'Password berhasil diubah');
			onPasswordChanged?.();
		} catch (error) {
			setErr(error.message || 'Gagal mengganti password');
		}
		setIsLoading(false);
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
				.gp-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box }
				.gp-root { min-height:100vh; padding:24px 18px 36px; background: linear-gradient(180deg, rgba(183, 216, 233, 0.6), rgba(243,251,255,0.6)), url(${bgRiwayat}); background-size:cover; background-position:center }
				.gp-back { max-width:460px; margin:0 auto 12px }
				.rw-back-btn { background:none; border:none; cursor:pointer; color:#07586a; font-size:13px; font-weight:600; padding:0 }
				.gp-card { width:100%; max-width:460px; margin:10px auto; background: linear-gradient(180deg, rgb(32, 104, 117), rgba(245,250,255,0.95)); border-radius:16px; padding:18px }
				.gp-input { width:100%; padding:12px 14px; border-radius:12px; border:none; background:#f8feff; font-size:14px }
				.gp-btn { width:100%; padding:12px 14px; border-radius:12px; border:none; background:#07586a; color:#fff; font-weight:700; cursor:pointer }
			`}</style>

			<div className="gp-root">
				<div className="gp-back">{onBack ? <button className="rw-back-btn" onClick={onBack}>‹ Kembali</button> : null}</div>

				<div style={{ maxWidth:460, margin:'8px auto' }}>
					<h1 style={{ margin:0, fontSize:26, fontWeight:800, color:'#0f172a' }}>Ganti Password</h1>
					<p style={{ marginTop:6, color:'rgb(23, 86, 111)' }}>Perbarui kata sandi akun Anda</p>
				</div>

				<form onSubmit={handleSubmit} className="gp-card">
					<div style={{ display:'grid', gap:10 }}>
						<label style={{ fontSize:13, fontWeight:700 }}>Password Saat Ini</label>
						<input className="gp-input" name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} />

						<label style={{ fontSize:13, fontWeight:700 }}>Password Baru</label>
						<input className="gp-input" name="newPassword" type="password" value={form.newPassword} onChange={handleChange} />

						<label style={{ fontSize:13, fontWeight:700 }}>Konfirmasi Password Baru</label>
						<input className="gp-input" name="confirm" type="password" value={form.confirm} onChange={handleChange} />

						<button type="submit" className="gp-btn">{isLoading ? 'Menyimpan...' : 'Ganti Password'}</button>

						{msg && <p style={{ color:'#064e3b', fontWeight:700 }}>{msg}</p>}
						{err && <p style={{ color:'#b91c1c', fontWeight:700 }}>{err}</p>}
					</div>
				</form>
			</div>
		</>
	);
};

export default GantiPassword;

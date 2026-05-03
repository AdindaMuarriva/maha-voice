import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import headIcon from '../../assets/head.png';
import bgRiwayat from '../../assets/bgriwayat.png';

const Profil = ({ currentUser, onBack, onLogout, onEditProfile, onChangePassword, onNavigate, onLanguageChange }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'id');

  const displayName = currentUser?.nama || currentUser?.fullName || 'Profil Pengguna';
  const email = currentUser?.email || currentUser?.npm || 'user@example.com';

  const { t, i18n } = useTranslation();

  const changeLang = (next) => {
    setLang(next);
    try { localStorage.setItem('lang', next); } catch (e) {}
    if (i18n && typeof i18n.changeLanguage === 'function') i18n.changeLanguage(next);
    if (typeof onLanguageChange === 'function') onLanguageChange(next);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        .pf-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }
        .pf-root {
          min-height: 100vh;
          width: 100%;
          padding: 24px 18px 36px;
          background: linear-gradient(180deg, rgba(234,248,255,0.6), rgba(243,251,255,0.6)), url(${bgRiwayat});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          color: #0f172a;
          overflow-y: auto;
        }

        .pf-back-bar { max-width: 460px; margin: 0 auto 10px; display:flex; align-items:center; }
        .rw-back-btn { background:none; border:none; cursor:pointer; color:#07586a; font-size:13px; font-weight:600; padding:0 }

        .pf-title { max-width:460px; margin:0 auto 14px; font-size:26px; font-weight:700; color:#0f172a }

        .pf-card { width:100%; max-width:460px; margin:0 auto 12px; padding:0; background:transparent; }

        .pf-nav-card, .pf-settings-card {
          width:100%; max-width:460px; margin:0 auto 14px; border-radius:20px;
          background: linear-gradient(180deg, rgba(221,245,255,0.9), rgba(215,236,247,0.9));
          border: none; box-shadow: 0 10px 24px rgba(8,49,76,0.06); overflow:hidden;
        }

        .pf-profile-block { padding:22px 20px 18px; display:flex; gap:12px; align-items:center; flex-direction:column; text-align:center }
        .pf-avatar { display:flex; width:96px; height:96px; border-radius:0; overflow:visible; flex-shrink:0; margin-bottom:8px; align-items:center; justify-content:center }
        .pf-avatar img { width:auto; height:96px; max-width:100%; object-fit:contain; display:block }
        .pf-name { margin:0; font-size:18px; font-weight:800; color:#063248; text-align:center }
        .pf-email { margin:0; font-size:13px; color:#17566f; text-align:center }

        .pf-actions { display:grid; gap:10px; padding: 6px 14px 16px }

        .pf-action-btn { width:100%; padding:12px 14px; display:flex; align-items:center; justify-content:space-between; gap:12px; border-radius:14px; background:transparent; color:#05303f; font-size:15px; font-weight:700; cursor:pointer; }
        .pf-action-btn:hover { transform: translateY(-2px); }

        .pf-action-left { display:flex; align-items:center; gap:12px }
        .pf-action-icon { width:44px; height:44px; border-radius:10px; background: rgba(255,255,255,0.95); display:flex; align-items:center; justify-content:center; box-shadow: 0 8px 18px rgba(8,49,76,0.06); overflow:hidden }
        .pf-action-icon img { width:24px; height:24px; object-fit:contain; display:block }
        .pf-action-text { display:flex; flex-direction:column; gap:3px; text-align:left }
        .pf-action-label { margin:0; font-size:15px; font-weight:800; color:#063248 }
        .pf-action-desc { margin:0; font-size:12px; color:#17566f }

        .pf-utility-list { display:grid; gap:8px; padding:10px }
        .pf-utility-item { width:100%; padding:14px 12px; display:flex; align-items:center; justify-content:space-between; background:transparent; border-radius:12px; color:#063248; font-size:15px; font-weight:700; cursor:pointer }
        .pf-utility-left { display:flex; gap:12px; align-items:center }
        .pf-utility-icon { width:36px; height:45px; border-radius:15px; background: rgba(255,255,255,0.95); display:flex; align-items:center; justify-content:center; box-shadow: 0 8px 18px rgba(8,49,76,0.04); overflow:hidden }
        .pf-utility-icon img { width:20px; height:20px; object-fit:contain; display:block }
        .pf-utility-sub { color:#17566f; font-size:13px; font-weight:600 }

        .pf-toggle { width:44px; height:26px; border-radius:999px; background: rgba(12,20,30,0.12); position:relative; flex-shrink:0 }
        .pf-toggle::before { content:''; position:absolute; top:4px; left:4px; width:18px; height:18px; border-radius:50%; background:#ffffff; box-shadow:0 6px 16px rgba(8,49,76,0.08); transform: translateX(${notificationsEnabled ? '18px' : '0px'}); transition: transform .18s ease }
        .pf-toggle.active { background: #07586a }

        .pf-logout { width:100%; max-width:460px; margin:0 auto; padding:12px 18px; border:none; border-radius:14px; background: rgba(255,255,255,0.98); color:#e11d48; font-size:15px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px }
        .pf-logout:hover { transform: translateY(-2px) }
      `}</style>

      <div className="pf-root">
        <div className="pf-back-bar">
          {onBack ? (
            <button className="rw-back-btn" onClick={onBack}>
              ‹ Kembali
            </button>
          ) : null}
        </div>

        <h1 className="pf-title">{t('profile.title')}</h1>

        <div className="pf-card">
          <div className="pf-profile-block">
              <div className="pf-avatar"><img src={headIcon} alt="avatar"/></div>
              <div>
                <p className="pf-name">{displayName}</p>
                <p className="pf-email">{email}</p>
              </div>
            </div>
        </div>

        <div className="pf-nav-card">
          <div className="pf-actions">
            <button className="pf-action-btn" type="button" onClick={onEditProfile}>
              <div className="pf-action-left">
                <div className="pf-action-icon">👤</div>
                <div className="pf-action-text">
                    <span className="pf-action-label">{t('profile.edit')}</span>
                    <span className="pf-action-desc">{t('profile.editDesc')}</span>
                </div>
              </div>
              <span>›</span>
            </button>
            <button className="pf-action-btn" type="button" onClick={onChangePassword}>
              <div className="pf-action-left">
                <div className="pf-action-icon">🔒</div>
                <div className="pf-action-text">
                    <span className="pf-action-label">{t('profile.pwd')}</span>
                    <span className="pf-action-desc">{t('profile.pwdDesc')}</span>
                </div>
              </div>
              <span>›</span>
            </button>
          </div>
        </div>

        <div className="pf-settings-card">
          <div className="pf-utility-list">
            <button className="pf-utility-item" type="button" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
              <div className="pf-utility-left">
                <div className="pf-utility-icon">🔔</div>
                <span>{t.notifications}</span>
              </div>
              <div className={`pf-toggle${notificationsEnabled ? ' active' : ''}`} />
            </button>
            <button className="pf-utility-item" type="button" onClick={() => setContactOpen(true)}>
                <div className="pf-utility-left">
                <div className="pf-utility-icon">📞</div>
                <span>{t('profile.contact')}</span>
              </div>
              <span className="pf-utility-sub">›</span>
            </button>
            <button className="pf-utility-item" type="button" onClick={() => { if (typeof onNavigate === 'function') onNavigate('riwayat'); }}>
                <div className="pf-utility-left">
                <div className="pf-utility-icon">🕒</div>
                <span>{t('profile.history')}</span>
              </div>
              <span className="pf-utility-sub">›</span>
            </button>
            <button className="pf-utility-item" type="button" onClick={() => changeLang(lang === 'id' ? 'en' : 'id')}>
                <div className="pf-utility-left">
                <div className="pf-utility-icon">🌐</div>
                <span>{t('profile.language')} — {lang === 'id' ? 'Indonesia' : 'English'}</span>
              </div>
              <span className="pf-utility-sub">›</span>
            </button>
          </div>
        </div>

          <button className="pf-logout" type="button" onClick={onLogout}>
            {t('profile.logout')}
          </button>
        </div>

        {/* Contact modal */}
        {contactOpen && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', zIndex: 1400 }}>
            <div style={{ width: '90%', maxWidth: 420, background: '#fff', borderRadius: 12, padding: 20 }}>
              <h3 style={{ margin: 0, marginBottom: 8 }}>{t('profile.contact')}</h3>
              <p style={{ margin: 0, marginBottom: 12, color: '#334155' }}>{t('profile.contactPersonLabel')}:</p>
              <p style={{ margin: 0, fontWeight: 700 }}>{t('profile.contactPersonName')}</p>
              <p style={{ marginTop: 8 }}><a href={`tel:${t('profile.contactPersonNumber')}`} style={{ color: '#07586a', fontWeight: 700 }}>{t('profile.contactPersonNumber')}</a></p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                <button onClick={() => { navigator.clipboard?.writeText(t('profile.contactPersonNumber')); alert(t('profile.copy')); }} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff' }}>{t('profile.copy')}</button>
                <button onClick={() => setContactOpen(false)} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#07586a', color: '#fff' }}>{t('profile.close')}</button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default Profil;

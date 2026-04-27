import bgAdmin from '../../../assets/BG_Admin.png';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'users', label: 'Mahasiswa' },
  { key: 'questions', label: 'Pertanyaan' },
  { key: 'recommendation', label: 'Rekomendasi' },
  { key: 'tips', label: 'Tips & Musik' },
  { key: 'results', label: 'Hasil Screening' },
];

const QUICK_ACTIONS = [
  { key: 'dashboard', label: 'Home' },
  { key: 'users', label: 'Mahasiswa' },
  { key: 'results', label: 'Screening' },
  { key: 'recommendation', label: 'Rekomendasi' },
  { key: 'tips', label: 'Tips & Musik' },
];

const AdminLayout = ({ activePage = 'dashboard', title, subtitle, children, onNavigate }) => {
  return (
    <div
      className="admin-page-bg"
      style={{
        minHeight: '100vh',
        color: '#183041',
        padding: 20,
        backgroundColor: '#f8fbfe',
        backgroundImage: `linear-gradient(rgba(248, 251, 254, 0.62), rgba(248, 251, 254, 0.62)), url(${bgAdmin})`,
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
          position: sticky;
          top: 20px;
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
          cursor: pointer;
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
        .admin-header-top {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
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
        .admin-quick-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
        }
        .admin-quick-action {
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid #dbe8ef;
          background: #f7fbfe;
          color: #3c7a92;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .admin-quick-action.active {
          background: #3c7a92;
          border-color: #3c7a92;
          color: #ffffff;
        }
        .admin-card {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 20px;
          padding: 18px 20px;
          box-shadow: 0 14px 40px rgba(24, 48, 65, 0.06);
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
        .admin-muted { color: #6b7f8c; }
        @media (max-width: 1100px) {
          .admin-shell { grid-template-columns: 1fr; }
          .admin-sidebar { min-height: auto; position: static; }
        }
      `}</style>

      <div className="admin-root admin-shell">
        <aside className="admin-sidebar">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#1b5a72' }}>mahavoice</div>
            <div style={{ fontSize: 12, color: '#4a7e95', fontWeight: 600 }}>Panel Admin</div>
          </div>

          <nav className="admin-menu">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`admin-menu-item${activePage === item.key ? ' active' : ''}`}
                onClick={() => onNavigate?.(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <div className="admin-header">
            <div className="admin-header-top">
              <div>
                <h1 className="admin-title">{title}</h1>
                {subtitle && <p className="admin-subtitle">{subtitle}</p>}
              </div>
              {activePage !== 'dashboard' && (
                <button
                  type="button"
                  className="admin-quick-action"
                  onClick={() => onNavigate?.('dashboard')}
                >
                  Kembali ke Dashboard
                </button>
              )}
            </div>

            <div className="admin-quick-actions">
              {QUICK_ACTIONS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`admin-quick-action${activePage === item.key ? ' active' : ''}`}
                  onClick={() => onNavigate?.(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

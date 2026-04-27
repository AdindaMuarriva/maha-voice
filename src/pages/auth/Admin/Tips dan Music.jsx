import AdminLayout from './AdminLayout';

const TipsAndMusic = ({ onNavigate }) => {
  return (
    <AdminLayout
      activePage="tips"
      title="Tips & Musik"
      subtitle="Kelola tips relaksasi dan musik pereda stres untuk mahasiswa."
      onNavigate={onNavigate}
    >
      <div className="admin-card">
        <div style={{ color: '#6b7f8c' }}>
          Halaman ini disiapkan untuk konten tips dan musik.
        </div>
      </div>
    </AdminLayout>
  );
};

export default TipsAndMusic;

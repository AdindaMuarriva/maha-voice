import AdminLayout from './AdminLayout';

const Rekomendasi = ({ onNavigate }) => {
  return (
    <AdminLayout
      activePage="recommendation"
      title="Rekomendasi"
      subtitle="Kelola rekomendasi berdasarkan level stres mahasiswa."
      onNavigate={onNavigate}
    >
      <div className="admin-card">
        <div style={{ color: '#6b7f8c' }}>
          Halaman ini disiapkan untuk data rekomendasi.
        </div>
      </div>
    </AdminLayout>
  );
};

export default Rekomendasi;

import AdminLayout from './AdminLayout';

const Pertanyaan_Screening = ({ onNavigate }) => {
  return (
    <AdminLayout
      activePage="questions"
      title="Pertanyaan Screening"
      subtitle="Kelola pertanyaan screening stress untuk mahasiswa."
      onNavigate={onNavigate}
    >
      <div className="admin-card">
        <div style={{ color: '#6b7f8c' }}>
          Halaman ini disiapkan untuk pengelolaan pertanyaan screening.
        </div>
      </div>
    </AdminLayout>
  );
};

export default Pertanyaan_Screening;

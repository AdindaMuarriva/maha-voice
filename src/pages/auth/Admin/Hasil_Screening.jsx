import AdminLayout from './AdminLayout';

const Hasil_Screening = ({ onNavigate }) => {
  return (
    <AdminLayout
      activePage="results"
      title="Hasil Screening"
      subtitle="Riwayat hasil screening seluruh mahasiswa dari tabel screenings."
      onNavigate={onNavigate}
    >
      <div className="admin-card">
        <div style={{ color: '#6b7f8c' }}>
          Halaman ini akan menampilkan hasil screening seluruh mahasiswa.
        </div>
      </div>
    </AdminLayout>
  );
};

export default Hasil_Screening;

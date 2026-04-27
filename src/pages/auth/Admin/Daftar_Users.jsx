import AdminLayout from './AdminLayout';

const Daftar_Users = ({ onNavigate }) => {
  return (
    <AdminLayout
      activePage="users"
      title="Mahasiswa"
      subtitle="Daftar akun mahasiswa yang tersimpan di tabel users Supabase."
      onNavigate={onNavigate}
    >
      <div className="admin-card">
        <div style={{ color: '#6b7f8c' }}>
          Halaman ini akan menampilkan daftar mahasiswa dari tabel users.
        </div>
      </div>
    </AdminLayout>
  );
};

export default Daftar_Users;

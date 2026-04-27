import { useState } from 'react';
import adminBg from '../../assets/loginbg.png';

const AdminLogin = ({ onAdminLogin }) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi Login Admin
    if (adminId && password) {
      onAdminLogin?.({ adminId, password });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .admin-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        .btn-admin {
            background: linear-gradient(90deg, #5BB0C5, #3C7A92);
            transition: all 0.25s ease;
        }

        .btn-admin:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(60,122,146,0.25);
        }

        .input-admin {
            transition: all 0.2s ease;
        }

        .input-admin:focus {
            border-color: #3C7A92;
            box-shadow: 0 0 0 3px rgba(60,122,146,0.15);
        }
      `}</style>

      <div 
        className="admin-root relative w-full h-screen flex items-center justify-center bg-white overflow-hidden"
        style={{
          backgroundImage: `url(${adminBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Layer Form */}
        <div className="relative z-10 w-full max-w-4xl px-10">
          
          <div className="mb-10 text-left">
            <h1 className="text-[52px] font-black text-[#3C7A92] leading-none tracking-tight">
              MASUK SEBAGAI ADMIN
            </h1>
            <p className="text-slate-800 font-bold text-lg mt-3">
              Halo Admin, masukkan ID dan Password yang terdaftar disini!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 w-full max-w-3xl">
            {/* Input ID */}
            <div className="space-y-2">
              <label className="block text-slate-900 font-bold text-lg ml-1">
                Masukkan ID
              </label>
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="input-admin w-full p-5 rounded-2xl border-2 border-slate-100 bg-white shadow-md outline-none text-lg"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="block text-slate-900 font-bold text-lg ml-1">
                Masukkan Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-admin w-full p-5 rounded-2xl border-2 border-slate-100 bg-white shadow-md outline-none text-lg"
              />
            </div>

            {/* Tombol Masuk */}
            <button 
                type="submit"
                className="btn-admin w-full py-4 mt-6 text-white rounded-2xl font-bold text-xl shadow-md active:scale-[0.97]"
            >
                Masuk
            </button>
          </form>

        </div>
      </div>
    </>
  );
};

export default AdminLogin;
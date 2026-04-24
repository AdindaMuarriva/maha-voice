import { useState } from 'react';
import authBg from '../../assets/authbg.png';

const Register = ({ onRegister, onLoginClick }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    npm: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.fullName.trim()) e.fullName = 'Nama wajib diisi';
    if (!formData.npm.trim()) e.npm = 'NPM wajib diisi';
    if (!formData.email.trim()) e.email = 'Email wajib diisi';
    if (!formData.password) e.password = 'Password wajib diisi';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegister?.(formData);
    }, 1200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        .register-root * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }

        .register-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 999px;
          border: none;
          background: #f1f5f9;
          font-size: 13.5px;
          outline: none;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }

        .register-input:focus {
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,150,161,0.15);
        }

        .register-btn {
          width: 100%;
          padding: 14px 0;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(90deg, #5BB0C5 0%, #2D5A66 100%);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 8px 24px rgba(45,90,102,0.35);
          transition: all 0.2s ease;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(45,90,102,0.45);
        }

        .register-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      <div
        className="register-root"
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          padding: '40px 24px 24px',
          backgroundImage: `url(${authBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        {/* Title */}
        <div style={{ marginTop: 50, marginBottom: 15 }}>
          <h1 style={{
            fontSize: 46,
            fontWeight: 900,
            margin: 0,
            color: '#2D5A66',
            letterSpacing: -1
          }}>
            DAFTAR
          </h1>

          <p style={{ fontSize: 14, marginTop: 2, fontWeight: 600 }}>
            Pengguna baru? Daftar akunmu disini.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>
              Masukkan Nama Lengkap
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>
              Masukkan NPM
            </label>
            <input
              type="text"
              name="npm"
              value={formData.npm}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>
              Masukkan E-Mail (email@domain.com)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>
              Buat Kata Sandi (min. 8 karakter)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="register-input"
            />
          </div>

          <button 
            type="submit" 
            className="register-btn"
            style={{ marginTop: 10 }}  
          >
            {isLoading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        {/* Login */}
        <p style={{
          textAlign: 'center',
          fontSize: 12.5,
          marginTop: 18,
          fontWeight: 600
        }}>
          Sudah Punya Akun?{' '}
          <button
            onClick={onLoginClick}
            style={{
              border: 'none',
              background: 'none',
              color: '#0096a1',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Masuk disini.
          </button>
        </p>

      </div>
    </>
  );
};

export default Register;
import { useState } from 'react';
import authBg from '../../assets/authbg.png';
import { loginUser } from '../../services/authApi';

const Login = ({ onLogin, onRegisterClick }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const e = {};
    if (!formData.email.trim()) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Email tidak valid';
    if (!formData.password) e.password = 'Kata sandi wajib diisi';
    else if (formData.password.length < 8) e.password = 'Minimal 8 karakter';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setIsLoading(true);
    setApiError('');

    try {
      const result = await loginUser(formData);
      onLogin?.(result);
    } catch (error) {
      setApiError(error.message || 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        .login-root * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        .login-input {
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

        .login-input:focus {
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,150,161,0.15);
        }

        .login-btn {
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

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(45,90,102,0.45);
        }

        .login-btn:active {
          transform: scale(0.97);
        }
      `}</style>

      <div
        className="login-root"
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
        <div style={{ marginTop: 80, marginBottom: 28 }}>
          <h1 style={{
            fontSize: 46,
            fontWeight: 900,
            margin: 0,
            color: '#2D5A66',
            letterSpacing: -1
          }}>
            MASUK
          </h1>

          <p style={{ fontSize: 14, marginTop: 6, fontWeight: 600}}>
            Sudah punya akun? Masuk disini.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>
              Masukkan E-Mail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=""
              className="login-input"
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 600 }}>
              Masukkan Kata Sandi
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=""
              className="login-input"
            />
          </div>

          <button type="submit" className="login-btn">
            {isLoading ? 'Loading...' : 'Masuk'}
          </button>

          {apiError && (
            <p style={{ margin: 0, fontSize: 12, color: '#b91c1c', fontWeight: 600 }}>
              {apiError}
            </p>
          )}
        </form>

        {/* Register */}
        <p style={{
          textAlign: 'center',
          fontSize: 12.5,
          marginTop: 18,
          fontWeight: 600
        }}>
          Belum Punya Akun?{' '}
          <button
            onClick={onRegisterClick}
            style={{
              border: 'none',
              background: 'none',
              color: '#0096a1',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Daftar disini.
          </button>
        </p>

      </div>
    </>
  );
};

export default Login;
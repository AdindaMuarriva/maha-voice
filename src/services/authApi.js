const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const loginUser = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/supabase/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Login gagal');
  }

  return result;
};

export const registerUser = async (payload) => {
  const requestBody = {
    nama: payload.nama || payload.fullName || '',
    npm: payload.npm,
    email: payload.email,
    password: payload.password,
  };

  const response = await fetch(`${API_BASE_URL}/supabase/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Registrasi gagal');
  }

  return result;
};

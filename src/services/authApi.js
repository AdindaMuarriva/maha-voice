const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

const requestJson = async (path, options) => {
  const url = `${API_BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  const response = await fetch(url, options);
  let result;

  try {
    result = await response.json();
  } catch (err) {
    throw new Error('Login gagal: respon server tidak valid');
  }

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Login gagal');
  }

  return result;
};

export const loginUser = async (payload) => {
  return requestJson('/supabase/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

export const registerUser = async (payload) => {
  const requestBody = {
    nama: payload.nama || payload.fullName || '',
    npm: payload.npm,
    email: payload.email,
    password: payload.password,
  };

  return requestJson('/supabase/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};

export const updateProfile = async (userId, payload) => {
  return requestJson(`/supabase/update-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...payload }),
  });
};

export const changePassword = async (userId, payload) => {
  return requestJson(`/supabase/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...payload }),
  });
};

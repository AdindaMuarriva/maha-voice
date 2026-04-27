const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Request gagal');
  }

  return result;
};

export const getAdminDashboard = () => requestJson('/admin/dashboard');

export const saveScreeningResult = (payload) =>
  requestJson('/admin/screenings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

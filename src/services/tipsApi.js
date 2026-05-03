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

export const getAllTips = async () => {
  const result = await requestJson('/tips');
  return Array.isArray(result?.data) ? result.data : [];
};

export const getTipsByCategory = async (category) => {
  const result = await requestJson(`/tips/category?category=${encodeURIComponent(String(category))}`);
  return Array.isArray(result?.data) ? result.data : [];
};

export const getAdminTips = () => requestJson('/tips/admin/all');

export const createTip = (payload) =>
  requestJson('/tips/admin/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateTip = (id, payload) =>
  requestJson(`/tips/admin/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteTip = (id) =>
  requestJson(`/tips/admin/delete/${id}`, {
    method: 'DELETE',
  });

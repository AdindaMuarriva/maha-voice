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

// ─────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────

export const getAllMusik = () => requestJson('/musik');

export const getMusikByCategory = (category) =>
  requestJson(`/musik/category?category=${encodeURIComponent(String(category))}`);

// ─────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────

export const getAdminMusik = () => requestJson('/musik/admin/all');

export const createMusik = (payload) =>
  requestJson('/musik/admin/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateMusik = (id, payload) =>
  requestJson(`/musik/admin/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteMusik = (id) =>
  requestJson(`/musik/admin/delete/${id}`, {
    method: 'DELETE',
  });

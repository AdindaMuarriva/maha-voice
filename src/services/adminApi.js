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

export const getAdminScreeningResults = (limit = 200) =>
  requestJson(`/admin/screening-results?limit=${encodeURIComponent(String(limit))}`);

export const getAdminUsers = (limit = 500) =>
  requestJson(`/admin/users?limit=${encodeURIComponent(String(limit))}`);

export const getAdminRecommendations = () => requestJson('/recommendations/admin');

export const getRecommendationByLevel = (level) =>
  requestJson(`/recommendations?level=${encodeURIComponent(String(level))}`);

export const saveRecommendation = (level, payload) =>
  requestJson(`/recommendations/admin/${encodeURIComponent(String(level))}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const saveScreeningResult = (payload) =>
  requestJson('/admin/screenings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getScreeningQuestions = () => requestJson('/screening/questions');

export const getUserScreeningHistory = (userId) =>
  requestJson(`/screening/history?userId=${encodeURIComponent(String(userId))}`);

export const getLatestUserScreening = async (userId) => {
  const result = await getUserScreeningHistory(userId);
  const histories = result.histories || result.data || [];
  if (histories.length === 0) return null;
  return {
    score: histories[0].skor,
    created_at: histories[0].tanggal,
    level: histories[0].level,
  };
};

export const getAdminScreeningQuestions = () => requestJson('/admin/screening-questions');

export const createScreeningQuestion = (payload) =>
  requestJson('/admin/screening-questions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateScreeningQuestion = (id, payload) =>
  requestJson(`/admin/screening-questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteScreeningQuestion = (id) =>
  requestJson(`/admin/screening-questions/${id}`, {
    method: 'DELETE',
  });

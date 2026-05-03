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
    console.error('Server Error Detail:', {
      status: response.status,
      statusText: response.statusText,
      path,
      result,
    });
    throw new Error(result.message || 'Request gagal');
  }

  return result;
};

export const getChatHistory = ({ userId, since, limit = 20 }) => {
  const params = new URLSearchParams();
  params.set('userId', userId);

  if (since) {
    params.set('since', since);
  }

  params.set('limit', String(limit));

  return requestJson(`/chat/history?${params.toString()}`);
};

export const sendChatMessage = ({ userId, sessionId, since, message }) =>
  requestJson('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ userId, sessionId, since, message }),
  });
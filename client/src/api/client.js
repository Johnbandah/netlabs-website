import API_URL from './config';

export const getToken = () => localStorage.getItem('netlabs_token');

const authHeaders = () => {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...authHeaders(),
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return response;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API error');
  }

  return data;
};

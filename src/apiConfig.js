const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Use relative path '' in production (same domain)
  // Use localhost:5000 for local development
  const API_BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
  
  return `${API_BASE_URL}${cleanEndpoint}`;
};

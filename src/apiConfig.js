const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const isProd = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

  // In production, force absolute path from origin to ensure reliability on Zoho/Onslate
  if (isProd && (API_BASE_URL.includes('localhost') || !API_BASE_URL)) {
    return `${window.location.origin}${cleanEndpoint}`;
  }
  
  return `${API_BASE_URL}${cleanEndpoint}`;
};

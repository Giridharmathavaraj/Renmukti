const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const isProd = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

  // In production, force absolute path from origin specifically for Catalyst/Onslate
  if (isProd && (!API_BASE_URL || API_BASE_URL.includes('localhost'))) {
    return cleanEndpoint; // Use relative path for maximum reliability on same-origin rewrites
  }
  
  return `${API_BASE_URL}${cleanEndpoint}`;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const isProd = import.meta.env.PROD || (typeof window !== 'undefined' && window.location.hostname !== 'localhost');

  // In production, force direct path to Catalyst function Node.js to solve 405 Method Not Allowed
  if (isProd) {
    return `/server/phase1${cleanEndpoint}`; 
  }
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${API_BASE_URL}${cleanEndpoint}`;
};

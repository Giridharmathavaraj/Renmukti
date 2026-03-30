const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Slate-only configuration: Always use relative path in production
  // so the React app communicates with the AppSail backend natively.
  const API_BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';
  
  return `${API_BASE_URL}${cleanEndpoint}`;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // In production, if VITE_API_URL is just the local port or empty, 
  // use relative paths to avoid "Unexpected token <" (HTML served by static host)
  if (import.meta.env.PROD && (API_BASE_URL.includes('localhost') || !API_BASE_URL)) {
    return cleanEndpoint;
  }
  
  return `${API_BASE_URL}${cleanEndpoint}`;
};

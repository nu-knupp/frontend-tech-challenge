// Environment configuration for API endpoints
// Detecta ambiente: SSR/Node ou browser
const isBrowser = typeof window !== 'undefined';

const API_BASE_URL = isBrowser
  ? process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
  : process.env.API_BASE_URL || 'http://json-server:3001';

export { API_BASE_URL };

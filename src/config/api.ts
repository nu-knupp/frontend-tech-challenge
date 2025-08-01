// Environment configuration for API endpoints
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://json-server:3001' 
  : 'http://localhost:3001';

export { API_BASE_URL };

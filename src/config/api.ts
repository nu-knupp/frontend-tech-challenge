const getApiUrl = () => {
  // In Docker environment, use the service name
  if (process.env.NODE_ENV === 'production' && process.env.DOCKER_ENV) {
    return 'http://json-server:3001';
  }
  
  // For development or when API_URL is explicitly set
  return process.env.API_URL || 'http://localhost:3001';
};

export const API_CONFIG = {
  baseUrl: getApiUrl(),
  transactionsUrl: `${getApiUrl()}/transactions`,
};

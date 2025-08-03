import path from 'path';

export const config = {
  dbPath: process.env.NODE_ENV === 'development' 
    ? path.resolve(process.cwd(), '..', '..', 'db')
    : path.resolve(process.cwd(), 'db'),
  
  usersFile: process.env.NODE_ENV === 'development'
    ? path.resolve(process.cwd(), '..', '..', 'db', 'users.json')
    : path.resolve(process.cwd(), 'db', 'users.json'),
    
  apiBaseUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : process.env.API_BASE_URL || 'http://localhost:3001'
};

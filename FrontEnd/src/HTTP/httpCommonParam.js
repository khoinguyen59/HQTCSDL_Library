import axios from 'axios';

const server = axios.create({
  baseURL: 'http://localhost:3000/db-api/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

server.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['x-access-token'] = token; // Keep legacy support if needed
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default server;

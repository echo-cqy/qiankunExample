import axios from 'axios';

// Basic Axios setup
const request = axios.create({
  baseURL: '/api', // Adjust as needed
  timeout: 10000,
});

request.interceptors.request.use((config) => {
  // Add token logic here if needed
  return config;
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default request;

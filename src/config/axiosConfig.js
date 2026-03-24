import axios from 'axios';
const axiosInstance = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-api-key': 'reqres_46b7211ee7bb44599042a913ff48f49c',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

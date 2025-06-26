import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://<EC2_PUBLIC_IP>:5000/api', // Flask API 서버 주소로 <EC2_PUBLIC_IP>를 바꿔야 합니당
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

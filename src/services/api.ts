import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://votre-adresse-ip:3000/api'; // Remplacez par l'URL de votre backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/profiles/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  const response = await api.put(`/profiles/${userId}`, profileData);
  return response.data;
};

export default api;
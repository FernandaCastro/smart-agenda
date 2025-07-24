import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
    baseURL: Constants.expoConfig?.extra?.API_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
      },
});

// Add an interceptor to add the token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

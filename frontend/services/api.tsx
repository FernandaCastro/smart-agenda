import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
    baseURL: Constants.expoConfig?.extra?.API_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
      },
});

export default api;

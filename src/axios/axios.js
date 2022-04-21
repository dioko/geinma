import axios from 'axios';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

export const baseUrl = 'http://10.0.0.9:8080/';

//export const baseUrl = 'http://192.168.0.2:8080/';

const instance = axios.create({
  baseURL: baseUrl,
});

instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default instance;

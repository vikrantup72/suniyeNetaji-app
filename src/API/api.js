import axios from 'axios';
import {getToken} from '../utils/helper';

const api = axios.create({
  baseURL: 'https://stage.suniyenetajee.com/api/v1/',

  //   timeout: 10000, // Adjust the timeout as needed
});

// Request interceptor for authorized requests
api.interceptors.request.use(
  config => {
    // Add authorization token to headers if available
    const token = getToken(); // Implement your token retrieval logic
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Common function for API requests
const makeRequest = async (method, url, data = null, headers = {}) => {
  try {
    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data,
    };
    const response = await api(config);
    return {data: response.data, status: response.status};
  } catch (error) {
    throw error;
  }
};

export const get = async (url, headers = {}) => {
  return await makeRequest('GET', url, null, headers);
};

export const post = async (url, data, headers = {}) => {
  console.log(data, 'inside post api');
  return await makeRequest('POST', url, data, headers);
};

export const put = async (url, data, headers = {}) => {
  console.log(data, 'inside put api');
  return await makeRequest('PUT', url, data, headers);
};

export const del = async (url, headers = {}) => {
  return await makeRequest('DELETE', url, null, headers);
};

export default api;

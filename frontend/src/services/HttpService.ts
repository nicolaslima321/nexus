import axios from 'axios';

export default class HttpService {
  private api;

  constructor() {
    const baseURL = process.env.baseURL;

    this.api = axios.create({
      baseURL,
    });

    this.api.interceptors.request.use(
      (config) => {

        const token = this.getJwtFromCookies();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const apiKey = this.getApiKey();
        if (apiKey) {
          config.headers['x-api-key'] = apiKey;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  getJwtFromCookies() {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1];
  }


  getApiKey() {
    return process.env.REACT_APP_API_KEY || 'sua-api-key-aqui';
  }

  async post(url, data, config = {}) {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch(url, data, config = {}) {
    try {
      const response = await this.api.patch(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async get(url, config = {}) {
    try {
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      console.error('Response Error:', error.response.data);
    } else if (error.request) {
      console.error('Request Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

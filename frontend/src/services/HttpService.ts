import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers'

class HttpService {
  private api;

  constructor() {
    const baseURL = 'http://backend:3000/';

    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      async (config) => {

        const token = await this.getJwt();
        if (token) {
          config.headers.Authorization = `Bearer ${token.value}`;
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

  async getJwt() {
    const cookieStore = await cookies();

    return cookieStore.get('accessToken');
  }


  getApiKey() {
    return process.env.API_KEY;
  }

  async post(url: string, data: object, config = {}) {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async patch(url: string, data: object, config = {}) {
    try {
      const response = await this.api.patch(url, data, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async get(url: string, config = {}) {
    try {
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  handleError(error: AxiosError) {
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

const httpService = new HttpService();

export default httpService;

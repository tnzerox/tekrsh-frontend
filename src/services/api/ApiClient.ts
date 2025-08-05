
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from '@/utils/constants';
import { message } from 'antd';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle common errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { response } = error;

        // Handle Laravel validation errors
        if (response?.status === 422) {
          const errors = response.data?.errors || {};
          Object.keys(errors).forEach(key => {
            errors[key].forEach((msg: string) => {
              message.error(msg);
            });
          });
          return Promise.reject(error);
        }

        // Handle unauthorized access
        if (response?.status === 401) {
          const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
          if (refreshToken) {
            try {
              const refreshResponse = await this.post<{ access_token: string }>('/auth/refresh', {
                refresh_token: refreshToken
              });
              if (refreshResponse.status === 200) {

                const newToken = refreshResponse.data.access_token;
                localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);

                // Retry the original request
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return this.client.request(error.config);
              } else {
                this.clearAuth();
                window.location.href = '/admin/login';
                message.error('Session expired. Please login again.');
              }
            } catch (refreshError) {
              this.clearAuth();
              window.location.href = '/admin/login';
              message.error('Session expired. Please login again.');
            }
          } else {
            this.clearAuth();
            window.location.href = '/admin/login';
            message.error('Unauthorized access. Please login.');
          }
        }

        // Handle forbidden access
        if (response?.status === 403) {
          message.error('You do not have permission to perform this action.');
          return Promise.reject(error);
        }

        // Handle server errors
        if (response?.status >= 500) {
          message.error('Server error. Please try again later.');
          return Promise.reject(error);
        }

        // Handle other errors
        const errorMessage = response?.data?.message || 'An error occurred';
        message.error(errorMessage);

        return Promise.reject(error);
      }
    );
  }

  private clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PERMISSIONS);
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config);
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();

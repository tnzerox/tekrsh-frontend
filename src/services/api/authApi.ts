
import { apiClient } from './ApiClient';
import { LoginCredentials, LoginResponse, User } from '@/types/auth';
import { API_ENDPOINTS } from '@/utils/constants';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  refreshToken: async (refreshToken: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post<{ access_token: string }>('/auth/refresh', { 
      refresh_token: refreshToken 
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<{ data: User }>(API_ENDPOINTS.AUTH.ME);
    return response.data.data;
  },
};

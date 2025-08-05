
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/ApiClient';
import { AxiosResponse } from 'axios';

export const useGenericApi = () => {
  const queryClient = useQueryClient();

  const get = async <T>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url);
    return response.data;
  };

  const post = async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data);
    return response.data;
  };

  const put = async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data);
    return response.data;
  };

  const patch = async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.patch(url, data);
    return response.data;
  };

  const del = async <T = void>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url);
    return response.data;
  };

  return {
    get,
    post,
    put,
    patch,
    del,
    queryClient,
  };
};

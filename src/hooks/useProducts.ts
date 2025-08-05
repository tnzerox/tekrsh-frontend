
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useGenericApi } from './useGenericApi';
import { Product, CreateProductRequest, UpdateProductRequest, ProductFilters } from '@/types/product';
import { API_ENDPOINTS } from '@/utils/constants';

export const useProducts = (filters?: ProductFilters) => {
  const { get, post, put, del } = useGenericApi();
  const queryClient = useQueryClient();

  // Build query string from filters
  const queryString = filters ? new URLSearchParams(
    Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  ).toString() : '';

  const endpoint = queryString ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}` : API_ENDPOINTS.PRODUCTS.LIST;

  const {
    data: productsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => get<{ data: Product[]; total: number; current_page: number; per_page: number }>(endpoint),
  });

  const createProduct = useMutation({
    mutationFn: (data: CreateProductRequest) => post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) => 
      put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => del(API_ENDPOINTS.PRODUCTS.DELETE(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return {
    products: productsData?.data || [],
    total: productsData?.total || 0,
    currentPage: productsData?.current_page || 1,
    perPage: productsData?.per_page || 10,
    isLoading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

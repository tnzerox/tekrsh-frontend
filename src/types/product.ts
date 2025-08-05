
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  category_id: number;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  category_id?: number;
  status?: 'active' | 'inactive';
  min_price?: number;
  max_price?: number;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

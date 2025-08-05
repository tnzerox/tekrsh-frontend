
export interface UserListItem {
  id: number;
  name: string;
  email: string;
  role: {
    name: string;
    slug: string;
  };
  onboarded: boolean;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role_id: number;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role_id?: number;
  phone?: string;
  is_active?: boolean;
}

export interface OnboardUserRequest {
  address: string;
  businessType: string;
  storeName: string;
  subdomain: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  theme: string;
}

export interface Onboarded {
  success: boolean;
  message: string;
  data: any;
}


export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone: string | null;
  role_id: number;
  is_active: boolean;
  last_login_at: string;
  organization_id: number;
  created_at: string;
  updated_at: string;
  role: Role;
  onboarded: boolean;
}

export interface Role {
  id: number;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot?: {
    role_id: number;
    permission_id: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
  user_type?: 'admin' | 'superadmin';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    user: User;
    access_token: string;
    refresh_token: string;
    user_type: string;
    permissions: string[];
    expires_at: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  permissions: string[];
  userType: 'admin' | 'superadmin' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

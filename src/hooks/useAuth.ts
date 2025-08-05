
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { loginAsync, logoutAsync, clearError } from '@/store/slices/authSlice';
import { LoginCredentials } from '@/types/auth';
import { hasPermission } from '@/utils/helpers';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (credentials: LoginCredentials) => {
    return dispatch(loginAsync(credentials));
  };

  const logout = async () => {
    return dispatch(logoutAsync());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const checkPermission = (permission: string) => {
    return hasPermission(auth.permissions, permission);
  };

  return {
    ...auth,
    login,
    logout,
    clearAuthError,
    checkPermission,
  };
};

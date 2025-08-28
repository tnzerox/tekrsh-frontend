
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ChevronLeft,
  ChevronRight,
  Shield,
  Crown,
  StoreIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { PERMISSIONS } from '@/utils/constants';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: React.ComponentType<any>;
  path: string;
  permission?: string;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  userType?: 'admin' | 'superadmin';
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, userType = 'admin' }) => {
  const { checkPermission } = useAuth();
  const location = useLocation();

  const adminMenuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      title: 'Products',
      icon: StoreIcon,
      path: '/admin/products',
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      title: 'Categories',
      icon: StoreIcon,
      path: '/admin/categories',
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
  ];

  const superAdminMenuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/superadmin/dashboard',
    },
  ];

  const menuItems = userType === 'superadmin' ? superAdminMenuItems : adminMenuItems;

  const visibleMenuItems = menuItems.filter(item => 
    !item.permission || checkPermission(item.permission)
  );

  const sidebarBg = userType === 'superadmin' 
    ? 'bg-gradient-to-b from-amber-900 to-orange-900' 
    : 'bg-gradient-to-b from-stone-800 to-emerald-800';

  return (
    <div className={cn(
      "text-white transition-all duration-300 flex flex-col shadow-2xl",
      sidebarBg,
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              {userType === 'superadmin' ? (
                <Crown className="h-6 w-6 mr-2 text-amber-300" />
              ) : (
                <Shield className="h-6 w-6 mr-2 text-emerald-300" />
              )}
              <h2 className="text-lg font-semibold">
                {userType === 'superadmin' ? 'SuperAdmin' : 'Admin Panel'}
              </h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-white hover:bg-white/10"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-lg transition-all duration-200",
                    isActive 
                      ? userType === 'superadmin'
                        ? "bg-amber-600/30 text-amber-100 shadow-lg"
                        : "bg-emerald-600/30 text-emerald-100 shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span className="font-medium">{item.title}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

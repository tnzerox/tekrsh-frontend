
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, Crown, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils/helpers';

interface HeaderProps {
  userType?: 'admin' | 'superadmin';
}

export const Header: React.FC<HeaderProps> = ({ userType = 'admin' }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const headerBg = userType === 'superadmin' 
    ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800' 
    : 'bg-gradient-to-r from-stone-50 to-emerald-50 border-stone-200 dark:from-stone-900/20 dark:to-emerald-900/20 dark:border-stone-800';

  const iconColor = userType === 'superadmin' ? 'text-amber-600' : 'text-emerald-600';

  return (
    <header className={`${headerBg} border-b px-6 py-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {userType === 'superadmin' ? (
            <Crown className={`h-6 w-6 mr-2 ${iconColor}`} />
          ) : (
            <Shield className={`h-6 w-6 mr-2 ${iconColor}`} />
          )}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {userType === 'superadmin' ? 'SuperAdmin Control Center' : 'Admin Dashboard'}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={userType === 'superadmin' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}>
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userType} Access
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

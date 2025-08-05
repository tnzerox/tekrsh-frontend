
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks';
import { Onboarding } from '@/pages/onboarding';

interface AdminLayoutProps {
  children: React.ReactNode;
  userType?: 'admin' | 'superadmin';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, userType = 'admin' }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  console.log('AdminLayout userType:', userType, 'user:', user);
  const bgClass = userType === 'superadmin' 
    ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950' 
    : 'bg-gradient-to-br from-stone-50 to-emerald-50 dark:from-stone-950 dark:to-emerald-950';


    if(user.onboarded === false) {
      return (<Onboarding />);
    }

  return (
    <div className={`min-h-screen ${bgClass} flex`}>
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
        userType={userType} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header userType={userType} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};


import React from 'react';
import { Card, Tag, Typography } from 'antd';

const { Text } = Typography;

interface PermissionsBadgeProps {
  permissions: string[];
  userType: 'admin' | 'superadmin';
}

export const PermissionsBadge: React.FC<PermissionsBadgeProps> = ({ permissions, userType }) => {
  return (
    <Card 
      title="Your Permissions"
      className="shadow-lg"
      styles={{
        header: { 
          backgroundColor: userType === 'superadmin' ? 'rgb(254 243 199)' : 'rgb(236 253 245)',
          borderBottom: `1px solid ${userType === 'superadmin' ? 'rgb(251 191 36)' : 'rgb(16 185 129)'}`
        }
      }}
    >
      <div className="space-y-2">
        {permissions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {permissions.map((permission) => (
              <Tag 
                key={permission} 
                color={userType === 'superadmin' ? 'gold' : 'green'}
              >
                {permission.replace(/_/g, ' ').toUpperCase()}
              </Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary">No permissions assigned</Text>
        )}
      </div>
    </Card>
  );
};

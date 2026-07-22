'use client';

import React from 'react';
import { useSession } from '@/lib/api';

interface PermissionGuardProps {
  resource: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'EXECUTE';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  resource,
  action,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { data: session } = useSession();
  const user = session?.user as any;

  if (!user) return null;

  // Super Admin and Admin bypass permission checks
  if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
    return <>{children}</>;
  }

  const permissions = user.permissions as Array<{ resource: string; action: string }> | undefined;
  const hasAccess = permissions?.some(
    (p) => p.resource === resource && p.action === action
  );

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

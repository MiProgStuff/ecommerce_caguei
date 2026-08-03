import React from 'react';

interface PermissionGuardProps {
  resource: string;
  action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'EXPORT' | 'EXECUTE';
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Admin access is now gated by a single shared superadmin code (see lib/admin-access.ts),
 * not per-user RBAC — anyone who reaches the dashboard already has full access.
 * Kept as a no-op passthrough so call sites don't need to change if this is reintroduced later.
 */
export function PermissionGuard({ children }: PermissionGuardProps) {
  return <>{children}</>;
}

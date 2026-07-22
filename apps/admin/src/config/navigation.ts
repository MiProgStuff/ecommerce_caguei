import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Users,
  BarChart3,
  Layers,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  resource?: string;
  action?: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';
  badge?: string;
}

export const navigationItems: NavItem[] = [
  {
    title: 'Overview',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/products',
    icon: Package,
    resource: 'products',
    action: 'READ',
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: ShoppingBag,
    resource: 'orders',
    action: 'READ',
  },
  {
    title: 'Inventory',
    href: '/inventory',
    icon: Boxes,
    resource: 'inventory',
    action: 'READ',
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
    resource: 'customers',
    action: 'READ',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    resource: 'analytics',
    action: 'READ',
  },
  {
    title: 'Collections',
    href: '/collections',
    icon: Layers,
    resource: 'collections',
    action: 'READ',
  },
  {
    title: 'Staff & Roles',
    href: '/users-permissions',
    icon: ShieldCheck,
    resource: 'users',
    action: 'READ',
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

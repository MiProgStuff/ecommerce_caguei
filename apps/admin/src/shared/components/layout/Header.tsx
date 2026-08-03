'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, Shield } from 'lucide-react';
import { useSession } from '@/lib/api';

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Paris',
        }) + ' CET'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/products')) return 'Products Inventory';
    if (path.startsWith('/orders')) return 'Orders Management';
    if (path.startsWith('/inventory')) return 'Inventory Control';
    if (path.startsWith('/customers')) return 'Customers Directory';
    if (path.startsWith('/analytics')) return 'Analytics Hub';
    if (path.startsWith('/collections')) return 'Collections & Drops';
    if (path.startsWith('/users-permissions')) return 'Staff & Roles Management';
    if (path.startsWith('/settings')) return 'System Settings';
    return 'Admin Console';
  };

  return (
    <header className="h-14 bg-[#141313] border-b border-[#27272A] px-6 flex items-center justify-between z-20 shrink-0">
      {/* Title & Path */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold tracking-tight text-white">
          {getPageTitle(pathname)}
        </h1>
        <span className="text-[#3F3F46]">/</span>
        <span className="font-mono text-[11px] text-[#A1A1AA] uppercase tracking-wider">
          EU-CENTRAL-1
        </span>
      </div>

      {/* Global Controls & Telemetry */}
      <div className="flex items-center gap-4">
        {/* Live CET Clock */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#18181B] border border-[#27272A] rounded-[4px] text-mono text-[11px] text-[#A1A1AA]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono">{timeString || '00:00:00 CET'}</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search orders, SKUs, customers..."
            className="w-full h-8 pl-8 pr-3 bg-[#18181B] border border-[#27272A] rounded-[4px] text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#C23B3B] transition-colors"
          />
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#18181B] border border-[#27272A] rounded-[4px]">
          <Shield className="w-3.5 h-3.5 text-[#C23B3B]" />
          <span className="font-mono text-[10px] font-semibold text-white uppercase tracking-wider">
            {user?.role || '...'}
          </span>
        </div>

        {/* Notifications Button */}
        <button
          className="relative p-2 text-[#A1A1AA] hover:text-white hover:bg-[#18181B] rounded-[4px] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C23B3B]" />
        </button>
      </div>
    </header>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { navigationItems } from '@/config/navigation';
import { useSidebarStore } from '@/shared/store/useSidebarStore';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { signOutUser, useSession } from '@/lib/api';

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { data: session } = useSession();
  const user = session?.user as any;

  const handleSignOut = async () => {
    await signOutUser();
    window.location.href = '/login';
  };

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#141313] border-r border-[#27272A] transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#27272A]">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="relative flex items-center justify-center w-7 h-7 rounded-[4px] shrink-0 overflow-hidden bg-obsidian-accent-soft">
            <Image src="/brand/logo-mark.png" alt="" fill className="object-contain p-0.5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-mono text-xs font-bold tracking-widest text-white uppercase">
                CAGUEI
              </span>
              <span className="font-mono text-[9px] text-[#A1A1AA] tracking-tight">
                ADMIN CONSOLE
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-[4px] text-[#A1A1AA] hover:text-white hover:bg-[#27272A] transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-2 mb-2">
            <span className="font-mono text-[10px] uppercase font-medium tracking-wider text-[#A1A1AA]">
              MANAGEMENT
            </span>
          </div>
        )}
        {navigationItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2.5 py-2 text-xs font-medium rounded-[4px] transition-colors ${
                isActive
                  ? 'bg-obsidian-accent text-white font-semibold'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#A1A1AA]'}`} />
              {!isCollapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Sign Out Footer */}
      <div className="p-2 border-t border-[#27272A] bg-[#18181B]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-1.5">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-[4px] bg-[#27272A] flex items-center justify-center font-mono text-xs text-white font-medium shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-white truncate">
                  {user?.name || 'Staff User'}
                </span>
                <span className="font-mono text-[10px] text-[#A1A1AA] truncate">
                  {user?.email || ''}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1 text-[#A1A1AA] hover:text-red-400 hover:bg-[#27272A] rounded-[4px] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center p-2 text-[#A1A1AA] hover:text-red-400 rounded-[4px] transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}

'use client';

import React from 'react';
import { ShieldCheck, UserPlus, Key } from 'lucide-react';
import { StatusBadge } from '@/shared/components/feedback/StatusBadge';

export function UsersPermissionsPage() {
  const roles = [
    {
      name: 'SUPER_ADMIN',
      description: 'Unrestricted full platform & database system control',
      memberCount: 1,
    },
    {
      name: 'ADMIN',
      description: 'Manage store catalog, products, orders, and fulfillment',
      memberCount: 3,
    },
    {
      name: 'INVENTORY_MANAGER',
      description: 'Warehouse stock updates, size variant management, stock alerts',
      memberCount: 2,
    },
    {
      name: 'MARKETING_MANAGER',
      description: 'Collection drops, promotional discount codes, analytics view',
      memberCount: 2,
    },
    {
      name: 'SUPPORT_AGENT',
      description: 'Read-only order tracking and customer support assistance',
      memberCount: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Staff Access & Role-Based Permissions (RBAC)
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA]">
            Enforce granular permissions, staff access controls, and security policies
          </p>
        </div>
        <button
          onClick={() => alert('Staff invitation drawer ready')}
          className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-1.5 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => (
          <div
            key={r.name}
            className="p-4 bg-[#18181B] border border-[#27272A] rounded-[4px] space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
                <span className="font-mono text-xs font-bold text-white uppercase">
                  {r.name.replace('_', ' ')}
                </span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-[#141313] border border-[#27272A] rounded-[4px] text-[#A1A1AA]">
                {r.memberCount} Staff Assigned
              </span>
            </div>
            <p className="text-xs text-[#A1A1AA]">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

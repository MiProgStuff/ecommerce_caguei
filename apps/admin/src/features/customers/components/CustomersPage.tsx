'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/shared/lib/api-client';
import { DataTable, Column } from '@/shared/components/data-table/DataTable';
import { StatusBadge } from '@/shared/components/feedback/StatusBadge';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

export function CustomersPage() {
  const { data, isLoading } = useQuery<{ users: any[] }>({
    queryKey: ['admin-customers'],
    queryFn: () => fetcher('/api/users'),
  });

  const columns: Column<any>[] = [
    {
      header: 'CUSTOMER NAME',
      cell: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs text-white truncate">
            {item.name || 'Anonymous User'}
          </span>
          <span className="font-mono text-[10px] text-[#A1A1AA] truncate">
            ID: {item.id.slice(0, 8)}
          </span>
        </div>
      ),
    },
    {
      header: 'EMAIL ADDRESS',
      cell: (item) => (
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#A1A1AA]">
          <Mail className="w-3 h-3 shrink-0" />
          <span>{item.email}</span>
        </div>
      ),
    },
    {
      header: 'PHONE NUMBER',
      cell: (item) => (
        <span className="font-mono text-xs text-white">
          {item.phoneNumber || 'Not provided'}
        </span>
      ),
    },
    {
      header: 'ROLE',
      cell: (item) => <StatusBadge status={item.role || 'CUSTOMER'} />,
    },
    {
      header: 'JOINED DATE',
      cell: (item) => (
        <span className="font-mono text-[10px] text-[#A1A1AA]">
          {new Date(item.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Customers Directory & LTV Telemetry
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA]">
            Registered client accounts, purchase volume, and profile data
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.users || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="No customer accounts found."
      />
    </div>
  );
}

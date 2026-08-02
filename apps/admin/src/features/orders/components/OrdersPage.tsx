'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/shared/lib/api-client';
import { DataTable, Column } from '@/shared/components/data-table/DataTable';
import { StatusBadge } from '@/shared/components/feedback/StatusBadge';
import { Search, Filter, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  estimatedTax: number;
  grandTotal: number;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  address?: {
    city: string;
    country: string;
  };
}

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data, isLoading } = useQuery<{
    orders: Order[];
    total: number;
    totalPages: number;
  }>({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () =>
      fetcher(
        `/api/orders?page=${page}&limit=10&status=${encodeURIComponent(statusFilter)}`
      ),
  });

  const columns: Column<Order>[] = [
    {
      header: 'ORDER REF',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-white">
          #{item.id.slice(0, 8)}
        </span>
      ),
    },
    {
      header: 'CUSTOMER',
      cell: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-white truncate">
            {item.user?.name || 'Guest Customer'}
          </span>
          <span className="font-mono text-[10px] text-[#A1A1AA] truncate">
            {item.user?.email || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'DESTINATION',
      cell: (item) => (
        <span className="font-mono text-[11px] text-[#A1A1AA]">
          {item.address ? `${item.address.city}, ${item.address.country}` : 'EU Region'}
        </span>
      ),
    },
    {
      header: 'STATUS',
      cell: (item) => <StatusBadge status={item.status || 'PAID'} />,
    },
    {
      header: 'AMOUNT',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-white">
          €{Number(item.grandTotal).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'DATE',
      cell: (item) => (
        <span className="font-mono text-[10px] text-[#A1A1AA]">
          {new Date(item.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      header: 'ACTIONS',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/orders/${item.id}`}
            className="p-1 text-[#A1A1AA] hover:text-white hover:bg-[#141313] rounded-none transition-colors border border-[#27272A]"
            title="View Order Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-none">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Orders Management & Dispatch Queue
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA]">
            Track settled customer orders, shipping status, and logistics
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-none font-mono text-xs font-semibold transition-colors border ${
              statusFilter === st
                ? 'bg-white text-black border-white'
                : 'bg-[#18181B] text-[#A1A1AA] border-[#27272A] hover:text-white'
            }`}
          >
            {st === '' ? 'ALL ORDERS' : st}
          </button>
        ))}
      </div>

      {/* High-density Data Table */}
      <DataTable
        columns={columns}
        data={data?.orders || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        emptyMessage="No customer orders matching selected filter."
      />
    </div>
  );
}

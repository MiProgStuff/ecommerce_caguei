'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/shared/lib/api-client';
import { DataTable, Column } from '@/shared/components/data-table/DataTable';
import { StatusBadge } from '@/shared/components/feedback/StatusBadge';
import { Boxes, AlertTriangle } from 'lucide-react';

export function InventoryPage() {
  const { data, isLoading } = useQuery<{ products: any[] }>({
    queryKey: ['inventory-products'],
    queryFn: () => fetcher('/api/products?limit=50'),
  });

  const columns: Column<any>[] = [
    {
      header: 'PRODUCT & SKU',
      cell: (item) => (
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs text-white truncate">
            {item.name}
          </span>
          <span className="font-mono text-[10px] text-[#A1A1AA] truncate">
            {item.id}
          </span>
        </div>
      ),
    },
    {
      header: 'CATEGORY',
      cell: (item) => (
        <span className="font-mono text-[11px] uppercase text-[#A1A1AA]">
          {item.category}
        </span>
      ),
    },
    {
      header: 'SIZE VARIANTS',
      cell: (item) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          {item.sizes.map((sz: string) => (
            <span
              key={sz}
              className="px-2 py-0.5 bg-[#141313] border border-[#27272A] rounded-[2px] font-mono text-[10px] font-semibold text-white"
            >
              {sz}: 12 in stock
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'STOCK STATUS',
      cell: () => <StatusBadge status="IN_STOCK" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Inventory Control & Warehouse Allocation
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA]">
            Real-time stock thresholds, reorder warnings, and warehouse telemetry
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.products || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage="No stock data available."
      />
    </div>
  );
}

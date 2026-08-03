'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/shared/lib/api-client';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { DataTable, Column } from '@/shared/components/data-table/DataTable';
import { StatusBadge } from '@/shared/components/feedback/StatusBadge';
import { DollarSign, ShoppingBag, Package, Activity, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  paidOrdersCount: number;
  averageOrderValue: number;
  recentOrders: Array<{
    id: string;
    grandTotal: number;
    createdAt: string;
  }>;
}

export function DashboardPage() {
  const { data, isLoading } = useQuery<AnalyticsOverview>({
    queryKey: ['analytics-overview'],
    queryFn: () => fetcher('/api/analytics/overview'),
  });

  const { data: recentOrdersData, isLoading: isOrdersLoading } = useQuery<{
    orders: any[];
  }>({
    queryKey: ['recent-orders'],
    queryFn: () => fetcher('/api/orders?limit=5'),
  });

  const columns: Column<any>[] = [
    {
      header: 'ORDER ID',
      accessorKey: 'id',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-white">
          #{item.id.slice(0, 8)}
        </span>
      ),
    },
    {
      header: 'CUSTOMER',
      cell: (item) => (
        <span className="text-xs text-white">
          {item.user?.name || item.user?.email || 'Guest Customer'}
        </span>
      ),
    },
    {
      header: 'STATUS',
      cell: (item) => <StatusBadge status={item.status || 'PAID'} />,
    },
    {
      header: 'TOTAL',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold text-white">
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
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            System Overview & Operations Dashboard
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA] mt-0.5">
            caguei vintage/collegiate streetwear • real-time telemetry feed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-1.5"
          >
            <span>Catalog Items</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="TOTAL REVENUE"
          value={isLoading ? '...' : `€${(data?.totalRevenue || 0).toLocaleString()}`}
          change="+14.2%"
          isPositive={true}
          icon={DollarSign}
          description="Gross settled store revenue"
        />
        <StatCard
          title="TOTAL ORDERS"
          value={isLoading ? '...' : (data?.totalOrders || 0).toString()}
          change="+8.4%"
          isPositive={true}
          icon={ShoppingBag}
          description="All time customer dispatches"
        />
        <StatCard
          title="CATALOG ITEMS"
          value={isLoading ? '...' : (data?.totalProducts || 0).toString()}
          change="0%"
          isPositive={true}
          icon={Package}
          description="Active streetwear products"
        />
        <StatCard
          title="AVG ORDER VALUE"
          value={isLoading ? '...' : `€${(data?.averageOrderValue || 0).toFixed(2)}`}
          change="+2.1%"
          isPositive={true}
          icon={Activity}
          description="Average checkout cart total"
        />
      </div>

      {/* Revenue Chart Section */}
      <RevenueChart
        data={
          data?.recentOrders?.map((o) => ({
            date: new Date(o.createdAt).toLocaleDateString('en-GB', { weekday: 'short' }),
            revenue: o.grandTotal,
          })) || []
        }
      />

      {/* Recent Activity Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
            Recent Dispatches & Transactions
          </h3>
          <Link
            href="/orders"
            className="font-mono text-[11px] text-[#C23B3B] hover:underline"
          >
            View all orders →
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={recentOrdersData?.orders || []}
          keyExtractor={(item) => item.id}
          isLoading={isOrdersLoading}
          emptyMessage="No recent customer orders found."
        />
      </div>
    </div>
  );
}

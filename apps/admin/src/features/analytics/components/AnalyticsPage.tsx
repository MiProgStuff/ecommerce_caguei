'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/shared/lib/api-client';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { RevenueChart } from '@/features/dashboard/components/RevenueChart';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Percent } from 'lucide-react';

export function AnalyticsPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['analytics-overview'],
    queryFn: () => fetcher('/api/analytics/overview'),
  });

  return (
    <div className="space-y-6">
      <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <h2 className="text-base font-bold text-white tracking-tight">
          Analytics & Financial Telemetry Hub
        </h2>
        <p className="font-mono text-xs text-[#A1A1AA]">
          Comprehensive sales performance, cart conversion rate, and revenue reporting
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="SETTLED REVENUE"
          value={isLoading ? '...' : `€${(data?.totalRevenue || 0).toLocaleString()}`}
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
        />
        <StatCard
          title="TOTAL ORDERS"
          value={isLoading ? '...' : (data?.totalOrders || 0).toString()}
          change="+6.2%"
          isPositive={true}
          icon={ShoppingBag}
        />
        <StatCard
          title="CONVERSION RATE"
          value="3.42%"
          change="+0.8%"
          isPositive={true}
          icon={Percent}
        />
        <StatCard
          title="AVERAGE CART VALUE"
          value={isLoading ? '...' : `€${(data?.averageOrderValue || 0).toFixed(2)}`}
          change="+4.1%"
          isPositive={true}
          icon={TrendingUp}
        />
      </div>

      <RevenueChart
        data={
          data?.recentOrders?.map((o: any) => ({
            date: new Date(o.createdAt).toLocaleDateString('en-GB', { weekday: 'short' }),
            revenue: o.grandTotal,
          })) || []
        }
      />
    </div>
  );
}

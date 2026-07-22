'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData =
    data.length > 0
      ? data
      : [
          { date: 'Mon', revenue: 4200 },
          { date: 'Tue', revenue: 6800 },
          { date: 'Wed', revenue: 5400 },
          { date: 'Thu', revenue: 8900 },
          { date: 'Fri', revenue: 12400 },
          { date: 'Sat', revenue: 15800 },
          { date: 'Sun', revenue: 11200 },
        ];

  return (
    <div className="w-full h-64 bg-[#18181B] border border-[#27272A] rounded-[4px] p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-semibold text-white">Revenue Performance</h3>
          <p className="font-mono text-[10px] text-[#A1A1AA]">
            Daily settled payments overview
          </p>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 border border-[#27272A] rounded-[4px] text-[#A1A1AA] bg-[#141313]">
          LIVE TELEMETRY
        </span>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#A1A1AA"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#27272A' }}
            />
            <YAxis
              stroke="#A1A1AA"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#27272A' }}
              tickFormatter={(v) => `€${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141313',
                borderColor: '#27272A',
                borderRadius: '4px',
                color: '#FFFFFF',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
              formatter={(val: any) => [`€${Number(val).toLocaleString()}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  description,
}: StatCardProps) {
  return (
    <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[4px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
          {title}
        </span>
        <div className="p-1.5 bg-[#141313] border border-[#27272A] rounded-[4px] text-[#A1A1AA]">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-mono text-2xl font-bold tracking-tight text-white">
          {value}
        </span>
        {change && (
          <div
            className={`flex items-center gap-1 font-mono text-xs font-semibold ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {description && (
        <span className="mt-1 font-mono text-[10px] text-[#A1A1AA]">
          {description}
        </span>
      )}
    </div>
  );
}

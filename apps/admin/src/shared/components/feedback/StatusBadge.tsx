'use client';

import React from 'react';

type StatusType =
  | 'PAID'
  | 'COMPLETED'
  | 'PENDING'
  | 'PROCESSING'
  | 'CANCELLED'
  | 'IN_STOCK'
  | 'LOW_STOCK'
  | 'OUT_OF_STOCK'
  | 'ACTIVE'
  | 'ARCHIVED';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const getStyle = (s: string) => {
    switch (s) {
      case 'PAID':
      case 'COMPLETED':
      case 'IN_STOCK':
      case 'ACTIVE':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50';
      case 'PROCESSING':
      case 'LOW_STOCK':
      case 'PENDING':
        return 'bg-amber-950/40 text-amber-400 border-amber-800/50';
      case 'CANCELLED':
      case 'OUT_OF_STOCK':
        return 'bg-rose-950/40 text-rose-400 border-rose-800/50';
      case 'ARCHIVED':
      default:
        return 'bg-zinc-800/40 text-zinc-400 border-zinc-700/50';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-[4px] font-mono text-[10px] font-semibold tracking-wider uppercase ${getStyle(
        normalized
      )} ${className}`}
    >
      <span className="w-1 h-1 rounded-full bg-current" />
      {normalized.replace('_', ' ')}
    </span>
  );
}

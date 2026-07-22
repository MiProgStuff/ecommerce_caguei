'use client';

import React from 'react';
import { Layers, Plus, Sparkles } from 'lucide-react';
import { StatusBadge } from '@/shared/components/feedback/StatusBadge';

export function CollectionsPage() {
  const collections = [
    {
      id: 'col_01',
      title: 'FALL/WINTER 2026 ARCHIVE',
      itemCount: 24,
      status: 'ACTIVE',
      dropDate: '2026-10-15',
    },
    {
      id: 'col_02',
      title: 'OBSIDIAN CAPSULE COLLECTION',
      itemCount: 12,
      status: 'ACTIVE',
      dropDate: '2026-08-01',
    },
    {
      id: 'col_03',
      title: 'SUMMER 2026 ESSENTIALS',
      itemCount: 18,
      status: 'ARCHIVED',
      dropDate: '2026-05-20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Seasonal Collections & Limited Drops
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA]">
            Curate brand drops, capsule releases, and campaign catalog groupings
          </p>
        </div>
        <button
          onClick={() => alert('New drop creation feature ready')}
          className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection Drop</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map((col) => (
          <div
            key={col.id}
            className="p-4 bg-[#18181B] border border-[#27272A] rounded-[4px] flex flex-col justify-between space-y-4 hover:border-[#3F3F46] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold text-[#A1A1AA]">
                {col.id}
              </span>
              <StatusBadge status={col.status} />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {col.title}
              </h3>
              <p className="font-mono text-xs text-[#A1A1AA] mt-1">
                {col.itemCount} streetwear products enrolled
              </p>
            </div>

            <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span className="font-mono text-[10px]">DROP: {col.dropDate}</span>
              <button className="text-white hover:underline text-xs font-medium">
                Edit Drop →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

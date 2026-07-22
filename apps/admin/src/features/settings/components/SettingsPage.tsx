'use client';

import React from 'react';
import { Settings, Sliders, Globe, Lock } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <h2 className="text-base font-bold text-white tracking-tight">
          System Settings & Platform Configuration
        </h2>
        <p className="font-mono text-xs text-[#A1A1AA]">
          Manage API gateways, Stripe webhook signatures, and email dispatchers
        </p>
      </div>

      <div className="space-y-4 max-w-3xl">
        <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-[4px] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#27272A] pb-3">
            <Globe className="w-4 h-4 text-[#3B82F6]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              API Server Gateway Configuration
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[#A1A1AA] text-[10px] uppercase mb-1">
                Central API Endpoint Base URL
              </label>
              <input
                type="text"
                readOnly
                value="http://localhost:4000"
                className="w-full h-8 px-3 bg-[#141313] border border-[#27272A] rounded-[4px] text-white"
              />
            </div>
            <div>
              <label className="block text-[#A1A1AA] text-[10px] uppercase mb-1">
                Database Target Region
              </label>
              <input
                type="text"
                readOnly
                value="PostgreSQL (eu-central-1 Frankfurt)"
                className="w-full h-8 px-3 bg-[#141313] border border-[#27272A] rounded-[4px] text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

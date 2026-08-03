'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { fetchUsers, updateUserRole, useSession, AdminUser } from '@/lib/api';

const roleStyles: Record<string, string> = {
  SUPER_ADMIN: 'text-[#C23B3B] border-[#C23B3B]/40 bg-[#C23B3B]/10',
  ADMIN: 'text-emerald-400 border-emerald-900 bg-emerald-950/40',
  CUSTOMER: 'text-[#A1A1AA] border-[#27272A] bg-[#141313]',
};

export function UsersPermissionsPage() {
  const { data: session } = useSession();
  const currentUser = session?.user as any;
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleAdmin = async (user: AdminUser) => {
    const nextRole = user.role === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
    setPendingId(user.id);
    const ok = await updateUserRole(user.id, nextRole);
    if (ok) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u)));
    }
    setPendingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Staff Access & Roles
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA]">
            {isSuperAdmin
              ? 'You are SUPER_ADMIN — promote or revoke admin access below.'
              : 'Read-only. Only a SUPER_ADMIN can promote or revoke admin access.'}
          </p>
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-[4px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#27272A] text-[10px] uppercase tracking-wider text-[#A1A1AA] font-mono">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-xs text-[#A1A1AA] font-mono">
                  Loading staff directory...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-xs text-[#A1A1AA] font-mono">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-[#27272A] last:border-0">
                  <td className="px-4 py-3 text-sm text-white">{u.name}</td>
                  <td className="px-4 py-3 text-xs text-[#A1A1AA] font-mono">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase border rounded-[4px] ${roleStyles[u.role] || roleStyles.CUSTOMER}`}>
                      <ShieldCheck className="w-3 h-3" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role === 'SUPER_ADMIN' ? (
                      <span className="text-[10px] text-[#A1A1AA] font-mono">—</span>
                    ) : isSuperAdmin ? (
                      <button
                        onClick={() => handleToggleAdmin(u)}
                        disabled={pendingId === u.id}
                        className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-[4px] transition-colors cursor-pointer disabled:opacity-50 ${
                          u.role === 'ADMIN'
                            ? 'border border-red-900 text-red-400 hover:bg-red-950/40'
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                      >
                        {pendingId === u.id ? '...' : u.role === 'ADMIN' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    ) : (
                      <span className="text-[10px] text-[#A1A1AA] font-mono">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

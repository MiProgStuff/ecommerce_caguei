'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/shared/lib/api-client';
import { DataTable, Column } from '@/shared/components/data-table/DataTable';
import { Search, Plus, Trash2, Edit3, Filter } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  color: string;
  material: string;
  images: string[];
  sizes: string[];
  createdAt: string;
}

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data, isLoading } = useQuery<{
    products: Product[];
    total: number;
    totalPages: number;
  }>({
    queryKey: ['admin-products', page, search, selectedCategory],
    queryFn: () =>
      fetcher(
        `/api/products?page=${page}&limit=10&search=${encodeURIComponent(
          search
        )}&category=${encodeURIComponent(selectedCategory)}`
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetcher(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const columns: Column<Product>[] = [
    {
      header: 'ITEM',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 bg-[#141313] border border-[#27272A] rounded-[4px] overflow-hidden shrink-0">
            {item.images && item.images[0] ? (
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-[#A1A1AA]">
                NO IMG
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-xs text-white truncate">
              {item.name}
            </span>
            <span className="font-mono text-[10px] text-[#A1A1AA] truncate">
              SKU: {item.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'CATEGORY',
      cell: (item) => (
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
          {item.category}
        </span>
      ),
    },
    {
      header: 'COLOR / MATERIAL',
      cell: (item) => (
        <span className="text-xs text-white">
          {item.color} • {item.material}
        </span>
      ),
    },
    {
      header: 'SIZES',
      cell: (item) => (
        <div className="flex items-center gap-1">
          {item.sizes.map((size) => (
            <span
              key={size}
              className="px-1.5 py-0.5 bg-[#141313] border border-[#27272A] rounded-[2px] font-mono text-[9px] font-semibold text-white"
            >
              {size}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'PRICE',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-white">
          €{Number(item.price).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'ACTIONS',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(item.id, item.name)}
            className="p-1 text-[#A1A1AA] hover:text-rose-400 hover:bg-[#141313] rounded-[4px] transition-colors"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Bar & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181B] border border-[#27272A] rounded-[4px]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Products Inventory & Catalog
          </h2>
          <p className="font-mono text-xs text-[#A1A1AA]">
            Manage luxury streetwear collections, prices, and variants
          </p>
        </div>
        <button
          onClick={() => alert('Product creation form drawer ready in next step')}
          className="px-3 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-[4px] transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Filter by name, SKU, or color..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-8 pl-8 pr-3 bg-[#18181B] border border-[#27272A] rounded-[4px] text-xs text-white placeholder-[#A1A1AA] focus:outline-none focus:border-[#3B82F6]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#A1A1AA]" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="h-8 px-2.5 bg-[#18181B] border border-[#27272A] rounded-[4px] font-mono text-xs text-white focus:outline-none focus:border-[#3B82F6]"
          >
            <option value="">All Categories</option>
            <option value="hoodies">Hoodies</option>
            <option value="t-shirts">T-Shirts</option>
            <option value="pants">Pants</option>
            <option value="outerwear">Outerwear</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* High-density Data Table */}
      <DataTable
        columns={columns}
        data={data?.products || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        page={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
        emptyMessage="No products matching current filter criteria."
      />
    </div>
  );
}

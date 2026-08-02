'use client';

import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetcher } from '@/shared/lib/api-client';
import { ProductForm } from '@/features/products/components/ProductForm';
import { ProductInput } from '@caguei/validations';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: (data: ProductInput) =>
      fetcher('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      router.push('/products');
      router.refresh();
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create product.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-none flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-1 text-[#A1A1AA] hover:text-white bg-[#141313] border border-[#27272A] rounded-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Create New Streetwear Catalog Item
            </h2>
            <p className="font-mono text-xs text-[#A1A1AA]">
              Add a brand new piece to Caguei catalog collections
            </p>
          </div>
        </div>
      </div>

      <ProductForm
        onSubmit={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}

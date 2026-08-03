'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { fetcher } from '@/shared/lib/api-client';
import { ProductForm } from '@/features/products/components/ProductForm';
import { ProductInput } from '@caguei/validations';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const { data: product, isLoading: isFetching } = useQuery<any>({
    queryKey: ['admin-product', id],
    queryFn: () => fetcher(`/api/products/id/${id}`),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductInput) =>
      fetcher(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-product', id] });
      router.push('/products');
      router.refresh();
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to update product.');
    },
  });

  if (isFetching) {
    return (
      <div className="h-64 flex items-center justify-center text-[#A1A1AA]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
              Edit Product: {product?.name || 'Catalog Item'}
            </h2>
            <p className="font-mono text-xs text-[#A1A1AA]">
              Update sizes, details, pricing model, and images (SKU: {id})
            </p>
          </div>
        </div>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={(data) => updateMutation.mutate(data)}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}

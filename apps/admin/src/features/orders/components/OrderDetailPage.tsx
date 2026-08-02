'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/shared/lib/api-client';
import { StatusBadge } from '@/shared/components/feedback/StatusBadge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fulfillmentSchema, FulfillmentInput } from '@caguei/validations';
import { ArrowLeft, Loader2, PackageOpen, Truck, Clipboard, User, MapPin } from 'lucide-react';
import Link from 'next/link';

interface OrderDetailPageProps {
  id: string;
}

export function OrderDetailPage({ id }: OrderDetailPageProps) {
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery<any>({
    queryKey: ['admin-order', id],
    queryFn: () => fetcher(`/api/orders/${id}`),
    enabled: !!id,
  });

  const fulfillMutation = useMutation({
    mutationFn: (data: FulfillmentInput) =>
      fetcher(`/api/orders/${id}/fulfill`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to dispatch order.');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FulfillmentInput>({
    resolver: zodResolver(fulfillmentSchema),
    defaultValues: {
      carrier: 'DHL Express',
      trackingCode: '',
      notes: '',
    },
  });

  const handleFulfillSubmit = (data: FulfillmentInput) => {
    fulfillMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard.');
  };

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center text-[#A1A1AA]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 bg-[#18181B] border border-[#27272A] text-center text-[#A1A1AA] font-mono text-xs rounded-none">
        Order not found or access forbidden.
      </div>
    );
  }

  const isFulfilled = order.status === 'COMPLETED';
  const showFulfillmentForm = order.status === 'PAID' || order.status === 'PROCESSING';

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="p-1 text-[#A1A1AA] hover:text-white bg-[#141313] border border-[#27272A] rounded-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Order details: #{order.id.slice(0, 8)}
              </h2>
              <StatusBadge status={order.status} />
            </div>
            <p className="font-mono text-xs text-[#A1A1AA] mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString('en-GB')}
            </p>
          </div>
        </div>
        {isFulfilled && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141313] border border-[#27272A] rounded-none text-mono text-xs text-[#A1A1AA]">
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>DISPATCHED: {order.carrier} ({order.trackingCode})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Client & Address info + Products */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer / Address Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-none space-y-3">
              <div className="flex items-center gap-2 border-b border-[#27272A] pb-2 text-white">
                <User className="w-4 h-4 text-[#3B82F6]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider">
                  Customer Profile
                </h4>
              </div>
              <div className="font-mono text-xs text-[#A1A1AA] space-y-1">
                <p className="text-white font-sans font-semibold">
                  {order.user?.name || 'Guest User'}
                </p>
                <p>Email: {order.user?.email || 'N/A'}</p>
                <p>Phone: {order.user?.phoneNumber || 'N/A'}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-none space-y-3">
              <div className="flex items-center gap-2 border-b border-[#27272A] pb-2 text-white">
                <MapPin className="w-4 h-4 text-[#3B82F6]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider">
                  Shipping Destination
                </h4>
              </div>
              <div className="font-mono text-xs text-[#A1A1AA] space-y-1">
                <p className="text-white font-sans">
                  {order.address?.street}
                </p>
                <p>
                  {order.address?.city}, {order.address?.state || ''}{' '}
                  {order.address?.postalCode}
                </p>
                <p className="uppercase font-bold text-[10px] text-white">
                  {order.address?.country}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-none overflow-hidden">
            <div className="px-4 py-3 bg-[#141313] border-b border-[#27272A]">
              <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Cart Items & Inventory Allocation
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#27272A] bg-[#141313]/60 text-[#A1A1AA] uppercase text-[10px]">
                    <th className="px-4 py-2.5">Streetwear Item</th>
                    <th className="px-4 py-2.5">Size</th>
                    <th className="px-4 py-2.5 text-right">Qty</th>
                    <th className="px-4 py-2.5 text-right">Price</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]/50 text-white">
                  {order.orderItems?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-[#201F1F]/40">
                      <td className="px-4 py-3 font-sans font-medium text-white">
                        {item.product?.name}
                        <span className="block font-mono text-[9px] text-[#A1A1AA]">
                          SKU: {item.productId}
                        </span>
                      </td>
                      <td className="px-4 py-3 uppercase">{item.size}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">€{Number(item.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold">
                        €{Number(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Billing & Fulfill Actions */}
        <div className="space-y-6">
          {/* Financial Totals */}
          <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-none space-y-3 font-mono text-xs">
            <h4 className="border-b border-[#27272A] pb-2 font-bold text-white uppercase text-[10px] tracking-wider">
              Billing breakdown
            </h4>
            <div className="space-y-2 text-[#A1A1AA]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">€{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="text-white">€{Number(order.estimatedTax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment & Shipping</span>
                <span className="text-white">€{Number(order.shippingCost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#27272A] text-white font-bold text-sm">
                <span>Grand Total</span>
                <span>€{Number(order.grandTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment actions form */}
          {showFulfillmentForm && (
            <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-none space-y-4">
              <div className="flex items-center gap-2 border-b border-[#27272A] pb-2 text-white">
                <PackageOpen className="w-4 h-4 text-[#3B82F6]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider">
                  Dispatch Shipment
                </h4>
              </div>

              <form onSubmit={handleSubmit(handleFulfillSubmit)} className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <label className="block text-[#A1A1AA] uppercase text-[10px]">Carrier</label>
                  <select
                    {...register('carrier')}
                    className="w-full h-8 px-2 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#3B82F6]"
                  >
                    <option value="DHL Express">DHL Express</option>
                    <option value="FedEx Premium">FedEx Premium</option>
                    <option value="UPS Worldwide">UPS Worldwide</option>
                    <option value="French Post Colissimo">Colissimo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[#A1A1AA] uppercase text-[10px]">Tracking Number</label>
                  <input
                    type="text"
                    {...register('trackingCode')}
                    placeholder="e.g. JVGL009988223"
                    className="w-full h-8 px-2.5 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                  {errors.trackingCode && (
                    <span className="text-rose-400 text-[10px]">{errors.trackingCode.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={fulfillMutation.isPending}
                  className="w-full h-9 bg-white text-black font-semibold uppercase text-xs rounded-none hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  {fulfillMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Truck className="w-4 h-4" />
                  )}
                  <span>Fulfill & Mark Dispatched</span>
                </button>
              </form>
            </div>
          )}

          {/* Fulfillment Details (dispatched state) */}
          {isFulfilled && (
            <div className="p-4 bg-[#18181B] border border-[#27272A] rounded-none space-y-3 font-mono text-xs">
              <h4 className="border-b border-[#27272A] pb-2 font-bold text-white uppercase text-[10px] tracking-wider">
                Shipment Logistics
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="block text-[#A1A1AA] text-[10px] uppercase">Carrier Partner</span>
                  <span className="text-white font-sans">{order.carrier}</span>
                </div>
                <div>
                  <span className="block text-[#A1A1AA] text-[10px] uppercase">Tracking ID</span>
                  <div className="flex items-center justify-between gap-2 p-1.5 bg-[#141313] border border-[#27272A] rounded-none">
                    <span className="text-white truncate font-bold text-mono">
                      {order.trackingCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(order.trackingCode)}
                      className="p-1 text-[#A1A1AA] hover:text-white bg-[#18181B] border border-[#27272A] rounded-none"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

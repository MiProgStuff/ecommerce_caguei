'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductInput } from '@caguei/validations';
import { Plus, Trash, Loader2 } from 'lucide-react';

interface ProductFormProps {
  initialData?: Partial<ProductInput>;
  onSubmit: (data: ProductInput) => void;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      category: initialData?.category || '',
      price: initialData?.price || 0,
      currency: initialData?.currency || 'EUR',
      color: initialData?.color || '',
      material: initialData?.material || '',
      description: initialData?.description || '',
      fabricCare: initialData?.fabricCare || 'Machine wash cold inside out',
      shipping: initialData?.shipping || 'Ships within 24 hours in luxury box',
      sizes: initialData?.sizes || [],
      images: initialData?.images || [''],
      details: initialData?.details || [''],
      stock: initialData?.stock || 0,
      costPrice: initialData?.costPrice,
      originalPrice: initialData?.originalPrice,
      promoPrice: initialData?.promoPrice,
      discountLabel: initialData?.discountLabel || '',
      isPromoActive: initialData?.isPromoActive || false,
    },
  });

  const [images, setImages] = useState<string[]>(initialData?.images || ['']);
  const [details, setDetails] = useState<string[]>(initialData?.details || ['']);

  const productName = watch('name');

  // Automatically generate slug from product name if editing a new product
  useEffect(() => {
    if (!initialData && productName) {
      const generatedSlug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [productName, setValue, initialData]);

  // Sync state variables to react-hook-form values when they change
  useEffect(() => {
    setValue('images', images, { shouldValidate: true });
  }, [images, setValue]);

  useEffect(() => {
    setValue('details', details, { shouldValidate: true });
  }, [details, setValue]);

  const costPrice = watch('costPrice');
  const originalPriceTouched = useRef(!!initialData?.originalPrice);

  // Auto-fill the list price as 10x the cost price, but stop overwriting it
  // once the admin has edited it by hand.
  useEffect(() => {
    if (originalPriceTouched.current) return;
    if (typeof costPrice === 'number' && !Number.isNaN(costPrice) && costPrice > 0) {
      setValue('originalPrice', Math.round(costPrice * 10 * 100) / 100, { shouldValidate: true });
    }
  }, [costPrice, setValue]);

  const discountLabelPresets = ['-10%', '-20%', '-30%', '-40%', '-50%', 'Liquidação'];

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'O/S'];

  const handleSizeChange = (size: string, checked: boolean) => {
    const currentSizes = watch('sizes') || [];
    if (checked) {
      setValue('sizes', [...currentSizes, size], { shouldValidate: true });
    } else {
      setValue(
        'sizes',
        currentSizes.filter((s) => s !== size),
        { shouldValidate: true }
      );
    }
  };

  const handleAddImage = () => {
    setImages([...images, '']);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) {
      setImages(['']);
    } else {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...images];
    updated[index] = val;
    setImages(updated);
  };

  const handleAddDetail = () => {
    setDetails([...details, '']);
  };

  const handleRemoveDetail = (index: number) => {
    if (details.length === 1) {
      setDetails(['']);
    } else {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const handleDetailChange = (index: number, val: string) => {
    const updated = [...details];
    updated[index] = val;
    setDetails(updated);
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      // NEXT_PUBLIC_API_URL must be a real routable host — never "http://0.0.0.0:PORT".
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || 'Upload failed');
      }

      const result = await response.json();
      if (result.url) {
        const updatedImages = [...images];
        const emptyIndex = updatedImages.indexOf('');
        if (emptyIndex !== -1) {
          updatedImages[emptyIndex] = result.url;
        } else if (updatedImages.length === 1) {
          // Single-image product: a new upload is almost always meant to
          // replace the existing photo, not sit alongside it as a 2nd item.
          updatedImages[0] = result.url;
        } else {
          updatedImages.push(result.url);
        }
        setImages(updatedImages);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed to upload image to MinIO: ${err.message}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      <div className="bg-[#18181B] border border-[#27272A] rounded-none p-6 space-y-6">
        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#27272A] pb-3">
          1. General Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Product Name</label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Sculptural Blazer 01"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.name && <span className="text-rose-400 text-[10px]">{errors.name.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Slug</label>
            <input
              type="text"
              {...register('slug')}
              placeholder="e.g. sculptural-blazer-01"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.slug && <span className="text-rose-400 text-[10px]">{errors.slug.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Category</label>
            <select
              {...register('category')}
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            >
              <option value="">Select Category</option>
              <option value="Outerwear">Outerwear</option>
              <option value="Knitwear">Knitwear</option>
              <option value="Trousers">Trousers</option>
              <option value="Accessories">Accessories</option>
            </select>
            {errors.category && (
              <span className="text-rose-400 text-[10px]">{errors.category.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Price (EUR)</label>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              placeholder="0.00"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.price && <span className="text-rose-400 text-[10px]">{errors.price.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Stock / Inventory Level</label>
            <input
              type="number"
              {...register('stock', { valueAsNumber: true })}
              placeholder="0"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.stock && <span className="text-rose-400 text-[10px]">{errors.stock.message}</span>}
          </div>
        </div>

        <div className="space-y-1 font-mono text-xs">
          <label className="block text-[#A1A1AA] uppercase text-[10px]">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Detailed description of the garment..."
            className="w-full p-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
          />
          {errors.description && (
            <span className="text-rose-400 text-[10px]">{errors.description.message}</span>
          )}
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-none p-6 space-y-6">
        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#27272A] pb-3">
          2. Attributes & Variants
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Color</label>
            <input
              type="text"
              {...register('color')}
              placeholder="e.g. Obsidian Black"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.color && <span className="text-rose-400 text-[10px]">{errors.color.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Material</label>
            <input
              type="text"
              {...register('material')}
              placeholder="e.g. 420gsm Virgin Japanese Wool"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.material && (
              <span className="text-rose-400 text-[10px]">{errors.material.message}</span>
            )}
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <label className="block text-[#A1A1AA] uppercase text-[10px]">Available Sizes</label>
          <div className="flex flex-wrap gap-3">
            {allSizes.map((size) => {
              const currentSizes = watch('sizes') || [];
              const isChecked = currentSizes.includes(size);
              return (
                <label
                  key={size}
                  className={`flex items-center gap-2 px-3 py-1.5 border cursor-pointer select-none transition-colors ${
                    isChecked
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-[#141313] text-[#A1A1AA] border-[#27272A] hover:text-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleSizeChange(size, e.target.checked)}
                    className="hidden"
                  />
                  <span>{size}</span>
                </label>
              );
            })}
          </div>
          {errors.sizes && <span className="text-rose-400 text-[10px]">{errors.sizes.message}</span>}
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-none p-6 space-y-6">
        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#27272A] pb-3">
          3. Media & Detail Specifications
        </h3>

        {/* MinIO File Upload */}
        <div className="space-y-1.5 font-mono text-xs p-3.5 bg-[#141313] border border-[#27272A] rounded-none">
          <label className="block text-[#A1A1AA] uppercase text-[10px] font-bold">
            Upload Image to MinIO Storage
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileUpload}
              className="text-[#A1A1AA] font-mono text-xs file:mr-4 file:py-1.5 file:px-3 file:border file:border-[#27272A] file:bg-[#18181B] file:text-white file:font-semibold file:cursor-pointer disabled:opacity-50"
            />
            {isUploading && (
              <span className="flex items-center gap-1.5 text-blue-400 font-mono text-[10px] uppercase">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Images */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Product Image URLs</label>
            <button
              type="button"
              onClick={handleAddImage}
              className="flex items-center gap-1 text-[10px] text-white hover:underline uppercase"
            >
              <Plus className="w-3.5 h-3.5" /> Add Image
            </button>
          </div>

          <div className="space-y-2">
            {images.map((img, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={img}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 text-[#A1A1AA] hover:text-rose-400 bg-[#141313] border border-[#27272A] rounded-none"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {errors.images && <span className="text-rose-400 text-[10px]">{errors.images.message}</span>}
        </div>

        {/* Dynamic Bullet Points (Details) */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Bullet point details</label>
            <button
              type="button"
              onClick={handleAddDetail}
              className="flex items-center gap-1 text-[10px] text-white hover:underline uppercase"
            >
              <Plus className="w-3.5 h-3.5" /> Add Detail
            </button>
          </div>

          <div className="space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Crafted in Portugal"
                  value={detail}
                  onChange={(e) => handleDetailChange(index, e.target.value)}
                  className="flex-1 h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(index)}
                  className="p-2 text-[#A1A1AA] hover:text-rose-400 bg-[#141313] border border-[#27272A] rounded-none"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          {errors.details && <span className="text-rose-400 text-[10px]">{errors.details.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Fabric Care Instructions</label>
            <input
              type="text"
              {...register('fabricCare')}
              placeholder="e.g. Machine wash cold inside out"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Shipping Details</label>
            <input
              type="text"
              {...register('shipping')}
              placeholder="e.g. Ships within 24 hours in luxury box"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#18181B] border border-[#27272A] rounded-none p-6 space-y-6">
        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider border-b border-[#27272A] pb-3">
          4. Pricing &amp; Promotions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Market / Cost Price (EUR)</label>
            <input
              type="number"
              step="0.01"
              {...register('costPrice', { valueAsNumber: true })}
              placeholder="e.g. 14.92"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.costPrice && <span className="text-rose-400 text-[10px]">{errors.costPrice.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Original / List Price (EUR)</label>
            <input
              type="number"
              step="0.01"
              {...register('originalPrice', {
                valueAsNumber: true,
                onChange: () => {
                  originalPriceTouched.current = true;
                },
              })}
              placeholder="e.g. 150.00"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.originalPrice && (
              <span className="text-rose-400 text-[10px]">{errors.originalPrice.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-[#A1A1AA] uppercase text-[10px]">Current Promo Price (EUR)</label>
            <input
              type="number"
              step="0.01"
              {...register('promoPrice', { valueAsNumber: true })}
              placeholder="e.g. 105.00"
              className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
            />
            {errors.promoPrice && <span className="text-rose-400 text-[10px]">{errors.promoPrice.message}</span>}
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs">
          <label className="block text-[#A1A1AA] uppercase text-[10px]">Discount Label</label>
          <input
            type="text"
            {...register('discountLabel')}
            placeholder="e.g. -30% or Liquidação"
            className="w-full h-9 px-3 bg-[#141313] border border-[#27272A] rounded-none text-white focus:outline-none focus:border-[#C23B3B] transition-colors"
          />
          <div className="flex flex-wrap gap-2">
            {discountLabelPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setValue('discountLabel', preset, { shouldValidate: true })}
                className="px-2.5 py-1 bg-[#141313] border border-[#27272A] text-[#A1A1AA] hover:text-white hover:border-[#C23B3B] text-[10px] uppercase transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
          {errors.discountLabel && (
            <span className="text-rose-400 text-[10px]">{errors.discountLabel.message}</span>
          )}
        </div>

        <label className="flex items-center gap-2 font-mono text-xs text-[#A1A1AA] uppercase cursor-pointer w-fit">
          <input type="checkbox" {...register('isPromoActive')} className="w-4 h-4 accent-[#C23B3B]" />
          Promoção Ativa — show the discount on the storefront
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#27272A]">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-none disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Save Catalog Item</span>
        </button>
      </div>
    </form>
  );
}

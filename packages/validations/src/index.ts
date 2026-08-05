import { z } from 'zod';

// ─── 1. Product Validation Schema ─────────────────────────────────────────────
const productObjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be greater than 0'),
  currency: z.string().default('EUR'),
  color: z.string().min(1, 'Color is required'),
  material: z.string().min(1, 'Material is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(z.string().url('Must be a valid image URL')).min(1, 'At least one image is required'),
  details: z.array(z.string()).default([]),
  fabricCare: z.string().default('Machine wash cold inside out'),
  shipping: z.string().default('Ships within 24 hours in luxury box'),
  sizes: z.array(z.string()).min(1, 'At least one size variant must be selected'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer').default(0),
  // Promotional pricing
  costPrice: z.number().nonnegative('Cost price cannot be negative').optional(),
  originalPrice: z.number().positive('Original price must be greater than 0').optional(),
  promoPrice: z.number().positive('Promo price must be greater than 0').optional(),
  discountLabel: z.string().optional(),
  isPromoActive: z.boolean().default(false),
});

// Only enforced when isPromoActive is explicitly true in the payload — on
// partial updates that don't touch promo fields, this check is skipped since
// there's no DB read here to compare against the persisted state.
function promoPricingRefinement(
  data: { isPromoActive?: boolean; originalPrice?: number; promoPrice?: number },
  ctx: z.RefinementCtx
) {
  if (!data.isPromoActive) return;

  if (data.originalPrice === undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['originalPrice'],
      message: 'Original price is required while a promotion is active',
    });
  }
  if (data.promoPrice === undefined) {
    ctx.addIssue({
      code: 'custom',
      path: ['promoPrice'],
      message: 'Promo price is required while a promotion is active',
    });
  }
  if (
    data.originalPrice !== undefined &&
    data.promoPrice !== undefined &&
    data.promoPrice >= data.originalPrice
  ) {
    ctx.addIssue({
      code: 'custom',
      path: ['promoPrice'],
      message: 'Promo price must be lower than the original price',
    });
  }
}

export const productSchema = productObjectSchema.superRefine(promoPricingRefinement);
export const productUpdateSchema = productObjectSchema.partial().superRefine(promoPricingRefinement);

export type ProductInput = z.infer<typeof productSchema>;

// ─── 2. Order Status & Fulfillment Schema ─────────────────────────────────────
export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
});

export const fulfillmentSchema = z.object({
  carrier: z.string().min(1, 'Carrier is required'),
  trackingCode: z.string().min(3, 'Tracking code must be at least 3 characters'),
  notes: z.string().optional(),
});

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;
export type FulfillmentInput = z.infer<typeof fulfillmentSchema>;

// ─── 3. Inventory Stock Schema ────────────────────────────────────────────────
export const inventoryAdjustSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  size: z.string().min(1, 'Size is required'),
  stockQuantity: z.number().int().min(0, 'Stock quantity cannot be negative'),
  reason: z.string().optional(),
});

export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>;

// ─── 4. User Role & Permissions Schema ────────────────────────────────────────
export const roleSchema = z.object({
  name: z.string().min(2, 'Role name is required'),
  description: z.string().optional(),
  permissions: z.array(
    z.object({
      resource: z.string(),
      action: z.enum(['READ', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'EXECUTE']),
    })
  ),
});

export type RoleInput = z.infer<typeof roleSchema>;

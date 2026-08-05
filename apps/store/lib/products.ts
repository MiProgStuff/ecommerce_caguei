export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "Outerwear" | "Knitwear" | "Trousers" | "Accessories";
  price: number;
  currency: string;
  color: string;
  material: string;
  description: string;
  images: string[];
  details: string[];
  fabricCare: string;
  shipping: string;
  sizes: string[];
  originalPrice?: number | null;
  promoPrice?: number | null;
  discountLabel?: string | null;
  isPromoActive?: boolean;
}

// The price actually charged: the active promo price when a promotion is
// running, otherwise the normal price. Use this everywhere a cart/checkout
// total or a displayed "current price" is computed.
export function getEffectivePrice(product: Product): number {
  return product.isPromoActive && typeof product.promoPrice === 'number'
    ? product.promoPrice
    : product.price;
}

export function getPromoDisplay(product: Product) {
  const active =
    !!product.isPromoActive &&
    typeof product.promoPrice === 'number' &&
    typeof product.originalPrice === 'number';

  return {
    active,
    current: active ? (product.promoPrice as number) : product.price,
    original: active ? (product.originalPrice as number) : undefined,
    label: active ? product.discountLabel ?? undefined : undefined,
  };
}

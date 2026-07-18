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
}

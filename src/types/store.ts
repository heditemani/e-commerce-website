export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  images: string[];
  stock: number;
  featured: boolean;
  variants: Record<string, string[]> | null;
  category: { name: string; slug: string };
};

export type CartItem = {
  product: Pick<Product, "id" | "name" | "slug" | "price" | "images" | "stock" | "variants">;
  quantity: number;
  variant?: Record<string, string>;
};

export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone?: string;
};

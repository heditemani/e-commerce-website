export const demoCategories = [
  { name: "Home & Living", slug: "home-living" },
  { name: "Accessories", slug: "accessories" },
  { name: "Apparel", slug: "apparel" },
] as const;

type DemoProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt: number | null;
  images: string[];
  stock: number;
  featured: boolean;
  popularity: number;
  categorySlug: string;
  variants: Record<string, string[]> | null;
};

export const demoProducts: DemoProduct[] = [
  {
    name: "Ritual Ceramic Vase",
    slug: "ritual-ceramic-vase",
    description: "A softly sculpted stoneware vase, made for a branch from the garden or simply the quiet beauty of its own shape. Hand-finished, so no two are exactly alike.",
    price: 6800,
    compareAt: null,
    images: ["https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1000&q=85"],
    stock: 18,
    featured: true,
    popularity: 91,
    categorySlug: "home-living",
    variants: null,
  },
  {
    name: "Everyday Linen Tote",
    slug: "everyday-linen-tote",
    description: "A roomy, unhurried carryall in sturdy washed linen. Long handles sit comfortably on the shoulder; a small inside pocket keeps the little things close.",
    price: 4200,
    compareAt: 5200,
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85"],
    stock: 27,
    featured: true,
    popularity: 74,
    categorySlug: "accessories",
    variants: { Color: ["Oat", "Olive", "Ink"] },
  },
  {
    name: "Soft Form Throw",
    slug: "soft-form-throw",
    description: "A generous, breathable throw woven from a soft cotton blend. The subtle texture and considered palette make it an easy layer for the sofa or the end of the bed.",
    price: 8900,
    compareAt: null,
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"],
    stock: 12,
    featured: true,
    popularity: 63,
    categorySlug: "home-living",
    variants: { Color: ["Natural", "Moss"] },
  },
  {
    name: "The Daily Shirt",
    slug: "the-daily-shirt",
    description: "An easy-fitting shirt cut from breathable cotton poplin. Thoughtful proportions, a clean collar, and just enough room to make it yours, day after day.",
    price: 7600,
    compareAt: null,
    images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85"],
    stock: 21,
    featured: false,
    popularity: 42,
    categorySlug: "apparel",
    variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Blue"] },
  },
];

export function getDemoProducts() {
  return demoProducts.map((product) => {
    const { categorySlug, ...fields } = product;
    return {
      ...fields,
      id: `demo_${product.slug}`,
      categoryId: `demo_category_${categorySlug}`,
      category: {
        name: demoCategories.find((category) => category.slug === categorySlug)!.name,
        slug: categorySlug,
      },
      createdAt: new Date("2025-01-01T00:00:00.000Z").toISOString(),
      updatedAt: new Date("2025-01-01T00:00:00.000Z").toISOString(),
    };
  });
}

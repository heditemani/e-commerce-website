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

type ProductBlueprint = {
  name: string;
  material: string;
  detail: string;
  basePrice: number;
  variants: Record<string, string[]> | null;
};

const catalogBlueprints: Record<string, ProductBlueprint[]> = {
  "home-living": [
    { name: "Ceramic Vase", material: "stoneware", detail: "its gently sculpted silhouette looks at home with a single stem or on its own", basePrice: 4800, variants: { Color: ["Oat", "Olive", "Chalk"] } },
    { name: "Table Lamp", material: "solid oak and linen", detail: "a warm, softly diffused glow makes slow evenings feel special", basePrice: 11200, variants: { Color: ["Natural", "Walnut"] } },
    { name: "Throw Blanket", material: "breathable cotton", detail: "a generous woven texture brings an easy layer to the sofa or bed", basePrice: 7600, variants: { Color: ["Oat", "Moss", "Clay"] } },
    { name: "Cushion Cover", material: "European flax linen", detail: "a relaxed weave adds a little texture to a favorite chair", basePrice: 3600, variants: { Color: ["Natural", "Olive", "Rust"] } },
    { name: "Serving Bowl", material: "hand-finished stoneware", detail: "a quietly useful shape moves from everyday meals to shared tables", basePrice: 4200, variants: { Color: ["Chalk", "Sand"] } },
    { name: "Wall Mirror", material: "solid ash wood and glass", detail: "a softly rounded frame brings light and an open feeling to a room", basePrice: 9800, variants: { Color: ["Natural", "Walnut"] } },
    { name: "Candle Holder", material: "cast ceramic", detail: "a balanced sculptural form makes a simple candle feel considered", basePrice: 2400, variants: { Color: ["Oat", "Ink", "Clay"] } },
    { name: "Storage Basket", material: "handwoven seagrass", detail: "a sturdy, natural weave keeps blankets and everyday bits close by", basePrice: 5400, variants: { Size: ["Small", "Large"] } },
    { name: "Side Table", material: "solid oak", detail: "a compact, useful surface keeps a book and a cup within reach", basePrice: 15400, variants: { Color: ["Natural", "Walnut"] } },
    { name: "Bedside Tray", material: "reclaimed wood", detail: "a simple catchall keeps small essentials neatly gathered", basePrice: 3200, variants: { Color: ["Natural", "Dark oak"] } },
    { name: "Ceramic Planter", material: "glazed stoneware", detail: "a breathable, considered home for the plants you love", basePrice: 3900, variants: { Size: ["Small", "Medium", "Large"] } },
    { name: "Table Runner", material: "washed cotton and linen", detail: "an easy layer brings a softer feel to weekday dinners", basePrice: 4400, variants: { Color: ["Natural", "Sage", "Clay"] } },
    { name: "Cotton Quilt", material: "soft, layered cotton", detail: "lightweight comfort and a subtle stitched texture make the bed feel inviting", basePrice: 12800, variants: { Size: ["Full", "Queen", "King"] } },
    { name: "Floor Cushion", material: "durable cotton canvas", detail: "a comfortable extra seat makes room for one more", basePrice: 6900, variants: { Color: ["Oat", "Olive"] } },
    { name: "Serving Platter", material: "hand-glazed stoneware", detail: "a generous shape makes sharing food feel effortless", basePrice: 5700, variants: { Color: ["Chalk", "Sand"] } },
    { name: "Wall Hook Set", material: "solid beech wood", detail: "a small, sturdy detail keeps coats and bags off the floor", basePrice: 2800, variants: { Color: ["Natural", "Walnut"] } },
    { name: "Desk Organizer", material: "solid oak", detail: "thoughtful compartments make a calmer place to work", basePrice: 4600, variants: { Color: ["Natural", "Walnut"] } },
    { name: "Soap Dispenser", material: "glazed ceramic and brushed metal", detail: "a refillable everyday essential feels right at home by the sink", basePrice: 3100, variants: { Color: ["Chalk", "Olive"] } },
    { name: "Photo Frame", material: "solid ash wood and glass", detail: "a slim frame gives favorite moments a place to be seen", basePrice: 2600, variants: { Size: ["5 × 7 in", "8 × 10 in"] } },
    { name: "Reed Diffuser", material: "recyclable glass and natural reeds", detail: "a gentle, lasting fragrance brings a welcoming note to any room", basePrice: 3500, variants: { Color: ["Cedar", "Citrus"] } },
  ],
  accessories: [
    { name: "Everyday Tote", material: "washed cotton canvas", detail: "roomy handles and an inside pocket keep daily essentials close", basePrice: 3800, variants: { Color: ["Oat", "Olive", "Ink"] } },
    { name: "Crossbody Bag", material: "supple full-grain leather", detail: "a hands-free shape keeps the essentials close on busy days", basePrice: 9800, variants: { Color: ["Tan", "Black", "Olive"] } },
    { name: "Leather Wallet", material: "responsibly sourced leather", detail: "a slim profile holds the cards and cash you reach for most", basePrice: 5200, variants: { Color: ["Tan", "Black"] } },
    { name: "Card Holder", material: "vegetable-tanned leather", detail: "a compact everyday essential slips easily into a pocket", basePrice: 2900, variants: { Color: ["Tan", "Ink", "Olive"] } },
    { name: "Everyday Scarf", material: "soft brushed cotton", detail: "a breathable layer adds an easy finish in changing weather", basePrice: 4200, variants: { Color: ["Oat", "Moss", "Rust"] } },
    { name: "Leather Belt", material: "full-grain leather", detail: "a clean, sturdy buckle and considered proportions make it a lasting staple", basePrice: 4600, variants: { Size: ["S", "M", "L"], Color: ["Tan", "Black"] } },
    { name: "Sunglasses", material: "recycled acetate and UV400 lenses", detail: "lightweight frames offer everyday comfort and full UV protection", basePrice: 6900, variants: { Color: ["Tortoise", "Black"] } },
    { name: "Travel Pouch", material: "recycled nylon", detail: "a zip-top compartment keeps smaller essentials together on the go", basePrice: 2400, variants: { Color: ["Olive", "Ink", "Clay"] } },
    { name: "Hair Clip Set", material: "durable cellulose acetate", detail: "a pair of easy, gentle-hold clips is ready for everyday styling", basePrice: 1800, variants: { Color: ["Tortoise", "Oat"] } },
    { name: "Canvas Backpack", material: "heavyweight cotton canvas", detail: "a padded sleeve and considered pockets make daily carry simple", basePrice: 8400, variants: { Color: ["Oat", "Olive", "Ink"] } },
    { name: "Key Ring", material: "solid brass and leather", detail: "a tactile loop keeps keys easy to find in a bag", basePrice: 1600, variants: { Color: ["Tan", "Black"] } },
    { name: "Scrunchie Set", material: "silky recycled fabric", detail: "soft, snag-free ties keep hair comfortable throughout the day", basePrice: 1500, variants: { Color: ["Oat", "Olive", "Rust"] } },
    { name: "Watch Strap", material: "soft-grain leather", detail: "a comfortable, adjustable strap gives a favorite watch a fresh feel", basePrice: 3900, variants: { Color: ["Tan", "Black"] } },
    { name: "Passport Holder", material: "vegetable-tanned leather", detail: "a slim sleeve keeps travel documents together and protected", basePrice: 3600, variants: { Color: ["Tan", "Olive"] } },
    { name: "Laptop Sleeve", material: "recycled felt and cotton", detail: "soft padding protects a laptop without adding unnecessary bulk", basePrice: 4900, variants: { Size: ["13 inch", "15 inch"], Color: ["Oat", "Charcoal"] } },
    { name: "Weekend Bag", material: "durable recycled canvas", detail: "a wide opening and easy-carry handles make a short trip feel lighter", basePrice: 11900, variants: { Color: ["Oat", "Olive", "Ink"] } },
    { name: "Coin Purse", material: "supple leather", detail: "a secure zip keeps coins and small essentials close at hand", basePrice: 2200, variants: { Color: ["Tan", "Black", "Clay"] } },
    { name: "Shoulder Bag", material: "soft-grain vegan leather", detail: "a comfortable strap and simple interior make it easy to carry all day", basePrice: 8900, variants: { Color: ["Oat", "Black", "Olive"] } },
    { name: "Phone Case", material: "recycled impact-resistant material", detail: "a slim, protective fit helps keep a phone ready for everyday life", basePrice: 2600, variants: { Color: ["Oat", "Olive", "Ink"] } },
    { name: "Jewelry Travel Case", material: "cotton velvet and recycled lining", detail: "soft compartments keep favorite pieces organized while traveling", basePrice: 4300, variants: { Color: ["Oat", "Olive", "Clay"] } },
  ],
  apparel: [
    { name: "Linen Shirt", material: "breathable European flax linen", detail: "an easy fit and clean collar make it a reliable everyday layer", basePrice: 7600, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Blue", "Oat"] } },
    { name: "Cotton T-Shirt", material: "soft organic cotton jersey", detail: "a comfortable neckline and considered cut make it a daily favorite", basePrice: 3200, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Olive", "Ink"] } },
    { name: "Relaxed Trousers", material: "lightweight cotton twill", detail: "an easy waistband and relaxed leg move comfortably through the day", basePrice: 8200, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Olive", "Ink"] } },
    { name: "Knit Sweater", material: "soft recycled cotton knit", detail: "a breathable, tactile layer works from cool mornings to late evenings", basePrice: 9600, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Moss", "Rust"] } },
    { name: "Everyday Dress", material: "washed cotton poplin", detail: "a simple shape and useful pockets make getting dressed feel easy", basePrice: 8900, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Blue", "Olive"] } },
    { name: "Cotton Overshirt", material: "midweight cotton twill", detail: "a relaxed cut layers comfortably over a tee or knit", basePrice: 9200, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Olive", "Ink"] } },
    { name: "Ribbed Tank", material: "organic cotton rib", detail: "a soft, breathable staple sits comfortably on its own or under a layer", basePrice: 2800, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Oat", "Black"] } },
    { name: "Cotton Cardigan", material: "responsibly sourced cotton yarn", detail: "an easy button-front layer brings warmth without feeling heavy", basePrice: 8800, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Moss", "Rust"] } },
    { name: "Pleated Skirt", material: "smooth recycled polyester and cotton", detail: "soft movement and a comfortable waistband make it easy to wear", basePrice: 7200, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Ink", "Olive"] } },
    { name: "Relaxed Shorts", material: "breathable cotton linen", detail: "a simple pull-on shape makes warm-weather dressing feel effortless", basePrice: 4900, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Blue", "Olive"] } },
    { name: "Denim Jacket", material: "recycled cotton denim", detail: "a familiar, durable layer is made to soften with every wear", basePrice: 10800, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Indigo", "Washed black"] } },
    { name: "Linen Blazer", material: "European flax linen", detail: "a relaxed shoulder and clean lines make smart layers feel natural", basePrice: 13800, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Ink"] } },
    { name: "Long Sleeve Tee", material: "soft organic cotton jersey", detail: "a comfortable layer with an easy shape for cooler days", basePrice: 3900, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Oat", "Ink"] } },
    { name: "Midi Skirt", material: "washed cotton and linen", detail: "a fluid shape and easy waistband make it a comfortable all-day piece", basePrice: 7400, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Olive", "Ink"] } },
    { name: "Knit Polo", material: "breathable cotton knit", detail: "a soft collar and easy texture add a little polish to an everyday staple", basePrice: 6800, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Moss", "Ink"] } },
    { name: "Wide Leg Pants", material: "soft drapey Tencel blend", detail: "a fluid leg and comfortable waist are made for easy movement", basePrice: 8400, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Ink", "Olive"] } },
    { name: "Work Shirt", material: "durable organic cotton", detail: "a sturdy weave and considered pockets make it a hardworking layer", basePrice: 7800, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Olive", "Blue"] } },
    { name: "Lounge Set", material: "soft organic cotton jersey", detail: "a breathable matching set makes slow mornings feel even better", basePrice: 9900, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Oat", "Sage", "Ink"] } },
    { name: "Button-Up Shirt", material: "lightweight cotton poplin", detail: "a clean, easy shape makes it a go-to from weekday to weekend", basePrice: 7200, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["White", "Blue", "Stripe"] } },
    { name: "Utility Jacket", material: "recycled cotton canvas", detail: "useful pockets and a comfortable fit make it a dependable outer layer", basePrice: 12400, variants: { Size: ["XS", "S", "M", "L", "XL"], Color: ["Olive", "Oat", "Ink"] } },
  ],
};

const productModifiers: Record<string, string[]> = {
  "home-living": ["Sculpted", "Soft Touch", "Hand Finished", "Everyday", "Natural", "Textured", "Minimal", "Sun Washed", "Quiet", "Artisan", "Modern", "Warm", "Organic", "Studio", "Timeless", "Relaxed", "Earth Tone", "Woven", "Calm", "Essential"],
  accessories: ["Washed Linen", "Pebbled Leather", "Soft Canvas", "Everyday", "Minimal", "Travel Ready", "Handwoven", "Lightweight", "Classic", "Compact", "Textured", "Relaxed", "Structured", "Coastal", "City", "Weekend", "Two Tone", "Natural", "Utility", "Studio"],
  apparel: ["Relaxed Fit", "Everyday", "Organic Cotton", "Lightweight", "Soft Knit", "Tailored", "Washed", "Easy", "Classic", "Boxy", "Textured", "Layering", "Weekend", "Studio", "Seasonless", "Airy", "Ribbed", "Utility", "Coastal", "Essential"],
};

const categoryImages: Record<string, string[]> = {
  "home-living": [
    "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
  ],
  apparel: [
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
  ],
};

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export const generatedProducts: DemoProduct[] = Object.entries(catalogBlueprints).flatMap(([categorySlug, items]) =>
  productModifiers[categorySlug].flatMap((modifier, modifierIndex) =>
    items.map((item, itemIndex) => {
      const name = titleCase(`${modifier} ${item.name}`);
      const slug = `${modifier}-${item.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const price = item.basePrice + modifierIndex * 130 + (itemIndex % 5) * 170;
      const compareAt = (modifierIndex + itemIndex) % 7 === 0 ? price + 1200 : null;

      return {
        name,
        slug,
        description: `${name} is made from ${item.material}. ${item.detail}. Designed with considered details and made to find a lasting place in your everyday.`,
        price,
        compareAt,
        images: [categoryImages[categorySlug][(modifierIndex + itemIndex) % categoryImages[categorySlug].length]],
        stock: (modifierIndex * 3 + itemIndex) % 29 === 0 ? 0 : 1 + ((modifierIndex * 7 + itemIndex * 3) % 32),
        featured: modifierIndex % 5 === 0 && itemIndex % 4 === 0,
        popularity: (modifierIndex * 7 + itemIndex * 13) % 100,
        categorySlug,
        variants: item.variants,
      };
    }),
  ),
);

export const catalogProducts = [...demoProducts, ...generatedProducts];

export function getDemoProducts() {
  return catalogProducts.map((product) => {
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

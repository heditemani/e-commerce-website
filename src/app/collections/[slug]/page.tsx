"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { demoCategories } from "@/lib/catalog-data";
import type { Product } from "@/types/store";

type CatalogResponse = { products: Product[]; pagination: { total: number } };

const collectionImages: Record<string, string> = {
  "home-living": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85",
  accessories: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1800&q=85",
  apparel: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85",
};

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const category = demoCategories.find((item) => item.slug === slug);

  useEffect(() => {
    if (!category) return;
    let active = true;
    fetch(`/api/products?category=${encodeURIComponent(slug)}&limit=48&sort=popular`)
      .then(async (response) => {
        if (!response.ok) throw new Error("We couldn't load this collection. Please try again.");
        return await response.json() as CatalogResponse;
      })
      .then((result) => { if (active) setProducts(result.products); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Something went wrong."); });
    return () => { active = false; };
  }, [category, slug]);

  if (!category) {
    return <section className="collection-not-found"><p className="eyebrow">NOT IN THIS EDIT</p><h1>This collection is <em>elsewhere.</em></h1><Link className="text-button" href="/collections"><ArrowLeft size={15} /> All collections</Link></section>;
  }

  return (
    <section className="collection-page">
      <Link className="back-link" href="/collections"><ArrowLeft size={15} /> ALL COLLECTIONS</Link>
      <header className="collection-hero">
        <Image src={collectionImages[slug]} alt={`${category.name} collection`} fill priority sizes="100vw" />
        <div className="collection-hero-shade" />
        <div className="collection-hero-copy"><p className="eyebrow">THE SHOPIT EDIT</p><h1>{category.name}</h1><p>Considered pieces for all the everyday moments.</p></div>
      </header>
      <div className="collection-products-heading"><div><p className="eyebrow">A THOUGHTFUL SELECTION</p><h2>Made to feel like <em>you.</em></h2></div><span>{products.length} {products.length === 1 ? "piece" : "pieces"}</span></div>
      {error ? <div className="message-box error-message">{error}</div> : null}
      {!error && products.length ? <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : null}
      {!error && !products.length ? <div className="empty-state"><p>We’re gathering this collection. Check back soon.</p><Link className="text-button" href="/collections">Explore another collection <ArrowLeft size={14} /></Link></div> : null}
    </section>
  );
}

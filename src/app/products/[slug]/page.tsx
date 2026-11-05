"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import type { Product } from "@/types/store";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let active = true;
    fetch(`/api/products/${encodeURIComponent(slug)}`)
      .then(async (response) => {
        if (response.status === 404) return null;
        if (!response.ok) throw new Error("Unable to load this product.");
        return (await response.json() as { product: Product }).product;
      })
      .then((result) => {
        if (!active) return;
        setProduct(result);
        setState(result ? "ready" : "missing");
      })
      .catch(() => { if (active) setState("missing"); });
    return () => { active = false; };
  }, [slug]);

  if (state === "loading") return <div className="page-loading">Finding the details…</div>;
  if (!product) return <div className="empty-state product-missing"><h1>This piece has moved on.</h1><Link className="text-button" href="/#shop">Return to the collection</Link></div>;
  return <ProductDetail product={product} />;
}

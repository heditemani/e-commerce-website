"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useCartStore } from "@/store/cart";

export default function FavoritesPage() {
  const favoriteProducts = useCartStore((state) => state.favoriteProducts);
  const hydrated = useCartStore((state) => state.hydrated);

  if (!hydrated) return <div className="page-loading">Opening your saved pieces…</div>;

  return (
    <section className="favorites-page">
      <header className="page-heading">
        <p className="eyebrow">KEPT CLOSE</p>
        <h1>Your <em>saved pieces.</em></h1>
        <span>{favoriteProducts.length} {favoriteProducts.length === 1 ? "piece" : "pieces"}</span>
      </header>
      {favoriteProducts.length ? (
        <div className="product-grid">{favoriteProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
      ) : (
        <div className="empty-favorites">
          <Heart size={25} />
          <h2>Keep the good ones <em>close.</em></h2>
          <p>Save pieces you love and they’ll be waiting here when you return.</p>
          <Link className="button button-dark" href="/#shop">Explore the collection <ArrowRight size={15} /></Link>
        </div>
      )}
    </section>
  );
}

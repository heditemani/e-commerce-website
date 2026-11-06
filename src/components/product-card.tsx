"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleFavorite = useCartStore((state) => state.toggleFavorite);
  const isFavorite = useCartStore((state) => state.favoriteProducts.some((favorite) => favorite.id === product.id));
  const [added, setAdded] = useState(false);
  return (
    <article className="product-card" style={{ animationDelay: `${index * 70}ms` }}>
      <div className="product-visual">
        <Link className="product-image" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}>
          {product.images[0] ? <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 650px) 45vw, (max-width: 900px) 30vw, 22vw" /> : <div className="image-placeholder" />}
          {product.compareAt && product.compareAt > product.price ? <span className="badge">Sale</span> : null}
          <span className="image-arrow"><ArrowUpRight size={17} /></span>
        </Link>
        <button className={isFavorite ? "favorite-button is-favorite" : "favorite-button"} type="button" aria-label={isFavorite ? `Remove ${product.name} from saved pieces` : `Save ${product.name}`} aria-pressed={isFavorite} onClick={() => toggleFavorite(product)}>
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <p className="eyebrow">{product.category.name}</p>
          <Link className="product-name" href={`/products/${product.slug}`}>{product.name}</Link>
          <p className="product-price">
            ${(product.price / 100).toFixed(2)}
            {product.compareAt && product.compareAt > product.price ? (
              <span className="old-price">${(product.compareAt / 100).toFixed(2)}</span>
            ) : null}
          </p>
        </div>
        <button
          className="icon-button add-button"
          aria-label={added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
          disabled={product.stock < 1}
          onClick={() => {
            addItem(product);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1500);
          }}
        >
          {added ? <Check size={17} /> : <Plus size={19} />}
        </button>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Check, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/store";

export function ProductDetail({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [variant, setVariant] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const variantGroups = Object.entries(product.variants ?? {});
  const canAdd = product.stock > 0 && variantGroups.every(([name]) => variant[name]);

  return (
    <section className="detail-page">
      <Link className="back-link" href="/#shop"><ArrowLeft size={15} /> BACK TO THE COLLECTION</Link>
      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-image">{product.images[selectedImage] ? <Image src={product.images[selectedImage]} alt={product.name} fill sizes="(max-width: 650px) 90vw, 55vw" priority /> : <div className="image-placeholder" />}</div>
          {product.images.length > 1 ? <div className="thumbnail-row">{product.images.map((image, index) => <button key={image} className={index === selectedImage ? "thumbnail active" : "thumbnail"} onClick={() => setSelectedImage(index)} aria-label={`View image ${index + 1}`}><Image src={image} alt="" fill sizes="66px" /></button>)}</div> : null}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category.name} / ATELIER OBJECTS</p>
          <h1>{product.name}</h1>
          <p className="detail-price">${(product.price / 100).toFixed(2)} {product.compareAt && product.compareAt > product.price ? <span className="old-price">${(product.compareAt / 100).toFixed(2)}</span> : null}</p>
          <div className={product.stock > 0 ? "stock-status" : "stock-status out-of-stock"}><span className="status-dot" />{product.stock > 0 ? `${product.stock < 5 ? "Almost gone — " : ""}In stock, ready to ship` : "Currently out of stock"}</div>
          <p className="detail-description">{product.description}</p>
          {variantGroups.map(([name, options]) => <fieldset className="variant-group" key={name}>
            <legend>{name}<span>{variant[name] ? ` / ${variant[name]}` : " / CHOOSE ONE"}</span></legend>
            <div className="variant-options">{options.map((option) => <button key={option} type="button" className={variant[name] === option ? "variant-option selected" : "variant-option"} onClick={() => setVariant((current) => ({ ...current, [name]: option }))}>{option}</button>)}</div>
          </fieldset>)}
          <div className="purchase-row">
            <div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)}><Minus size={14} /></button><span>{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= Math.min(product.stock, 20)} onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button></div>
            <button className="button button-dark add-to-bag" disabled={!canAdd} onClick={() => { addItem(product, quantity, variant); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }}>
              {added ? <><Check size={16} /> Added to your bag</> : <><ShoppingBag size={16} /> {product.stock ? "Add to bag" : "Out of stock"}</>}
            </button>
          </div>
          <div className="detail-perks"><p><span>01</span> Considered materials, made to last.</p><p><span>02</span> Free shipping on orders over $100.</p><p><span>03</span> Thoughtfully packed, always.</p></div>
        </div>
      </div>
    </section>
  );
}

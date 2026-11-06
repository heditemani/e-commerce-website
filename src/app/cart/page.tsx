"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const { items, hydrated, updateQuantity, removeItem } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08);
  const shipping = subtotal >= 10000 ? 0 : items.length ? 800 : 0;
  const total = subtotal + tax + shipping;
  const shippingProgress = Math.min(100, (subtotal / 10000) * 100);
  if (!hydrated) return <div className="page-loading">Opening your bag…</div>;

  return (
    <section className="cart-page">
      <div className="page-heading"><p className="eyebrow">YOUR EDIT</p><h1>Your <em>bag.</em></h1><span>{items.reduce((count, item) => count + item.quantity, 0)} pieces</span></div>
      {!items.length ? <div className="empty-cart"><div className="empty-bag-mark">A</div><h2>Nothing here, <em>yet.</em></h2><p>Good things are waiting to be found.</p><Link className="button button-dark" href="/#shop">Explore the collection <ArrowRight size={15} /></Link></div> : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(({ product, quantity, variant }) => <article className="cart-item" key={`${product.id}-${JSON.stringify(variant ?? {})}`}>
              <Link className="cart-item-image" href={`/products/${product.slug}`}>{product.images[0] ? <Image src={product.images[0]} alt={product.name} fill sizes="92px" /> : <div className="image-placeholder" />}</Link>
              <div className="cart-item-info"><p className="eyebrow">ATELIER OBJECT</p><Link href={`/products/${product.slug}`} className="cart-item-name">{product.name}</Link>{variant ? <p className="cart-variant">{Object.entries(variant).map(([name, value]) => `${name}: ${value}`).join(" · ")}</p> : null}<span className="cart-unit-price">${(product.price / 100).toFixed(2)}</span></div>
              <div className="cart-item-controls"><div className="quantity-control"><button aria-label={`Decrease ${product.name} quantity`} disabled={quantity <= 1} onClick={() => updateQuantity(product.id, quantity - 1, variant)}><Minus size={13} /></button><span>{quantity}</span><button aria-label={`Increase ${product.name} quantity`} disabled={quantity >= product.stock} onClick={() => updateQuantity(product.id, quantity + 1, variant)}><Plus size={13} /></button></div><button className="remove-button" onClick={() => removeItem(product.id, variant)} aria-label={`Remove ${product.name}`}><Trash2 size={14} /><span>Remove</span></button></div>
              <p className="cart-line-price">${(product.price * quantity / 100).toFixed(2)}</p>
            </article>)}
            <Link href="/#shop" className="continue-link"><ArrowRight size={14} /> Keep looking</Link>
          </div>
          <aside className="order-summary"><p className="eyebrow">THE NUMBERS</p><h2>Order <em>summary.</em></h2><div className="shipping-progress"><div className="shipping-progress-copy">{subtotal >= 10000 ? <span>You unlocked complimentary shipping!</span> : <span>Add <strong>${((10000 - subtotal) / 100).toFixed(2)}</strong> for complimentary shipping</span>}<span>{Math.round(shippingProgress)}%</span></div><div className="shipping-progress-track" role="progressbar" aria-label="Progress toward complimentary shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(shippingProgress)}><span style={{ width: `${shippingProgress}%` }} /></div></div><div className="summary-line"><span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span></div><div className="summary-line"><span>Estimated tax</span><span>${(tax / 100).toFixed(2)}</span></div><div className="summary-line"><span>Shipping</span><span>{shipping ? "$8.00" : "Complimentary"}</span></div><div className="summary-note">Shipping is complimentary on orders over $100.</div><div className="summary-total"><span>Total</span><strong>${(total / 100).toFixed(2)}</strong></div><Link className="button button-dark checkout-button" href="/checkout">Continue to checkout <ArrowRight size={15} /></Link><p className="checkout-caption">SECURE CHECKOUT · PAYMENT SIMULATION</p></aside>
        </div>
      )}
    </section>
  );
}

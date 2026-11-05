"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { useCartStore } from "@/store/cart";
import type { ShippingAddress } from "@/types/store";

const initialAddress: ShippingAddress = {
  name: "", line1: "", line2: "", city: "", region: "", postalCode: "", country: "US", phone: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, hydrated, clearCart } = useCartStore();
  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08);
  const shipping = subtotal >= 10000 ? 0 : items.length ? 800 : 0;
  const total = subtotal + tax + shipping;

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ product, quantity, variant }) => ({ productId: product.id, quantity, variant })),
          address,
        }),
      });
      const result = await response.json() as { error?: string; order?: { id: string } };
      if (response.status === 401) {
        router.push("/login?next=/checkout");
        return;
      }
      if (!response.ok || !result.order) throw new Error(result.error ?? "We couldn't place your order.");
      clearCart();
      router.push(`/account?ordered=${encodeURIComponent(result.order.id)}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) return <div className="page-loading">Preparing checkout…</div>;
  if (!items.length) return <div className="empty-cart"><h2>Your bag is <em>empty.</em></h2><Link className="button button-dark" href="/#shop">Explore the collection <ArrowRight size={15} /></Link></div>;

  return (
    <section className="checkout-page">
      <Link href="/cart" className="back-link"><ArrowLeft size={15} /> BACK TO YOUR BAG</Link>
      <div className="page-heading checkout-heading"><p className="eyebrow">ALMOST YOURS</p><h1>Make it <em>yours.</em></h1><p>Shipping is on us over $100.</p></div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={placeOrder}>
          <div className="form-section"><div className="form-section-heading"><span>01</span><div><h2>Where to?</h2><p>Your order will find its way.</p></div></div>
            <div className="form-grid">
              <label className="form-field full-field"><span>FULL NAME</span><input required maxLength={100} value={address.name} onChange={(event) => setAddress({ ...address, name: event.target.value })} autoComplete="name" /></label>
              <label className="form-field full-field"><span>ADDRESS LINE 1</span><input required maxLength={200} value={address.line1} onChange={(event) => setAddress({ ...address, line1: event.target.value })} autoComplete="address-line1" /></label>
              <label className="form-field full-field"><span>ADDRESS LINE 2 <i>OPTIONAL</i></span><input maxLength={200} value={address.line2} onChange={(event) => setAddress({ ...address, line2: event.target.value })} autoComplete="address-line2" /></label>
              <label className="form-field"><span>CITY</span><input required maxLength={100} value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} autoComplete="address-level2" /></label>
              <label className="form-field"><span>STATE / REGION</span><input required maxLength={100} value={address.region} onChange={(event) => setAddress({ ...address, region: event.target.value })} autoComplete="address-level1" /></label>
              <label className="form-field"><span>POSTAL CODE</span><input required maxLength={20} value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} autoComplete="postal-code" /></label>
              <label className="form-field"><span>COUNTRY CODE</span><input required minLength={2} maxLength={2} value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value.toUpperCase() })} autoComplete="country" /></label>
              <label className="form-field full-field"><span>PHONE <i>OPTIONAL</i></span><input type="tel" maxLength={30} value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} autoComplete="tel" /></label>
            </div>
          </div>
          <div className="form-section payment-section"><div className="form-section-heading"><span>02</span><div><h2>Payment, simply.</h2><p>This starter uses a mock payment—no card details required.</p></div></div><div className="mock-payment"><LockKeyhole size={17} /><div><strong>Secure demo checkout</strong><span>Payment is simulated. No charge will be made.</span></div><span className="mock-pill">MOCK</span></div></div>
          {error ? <div className="message-box error-message">{error}</div> : null}
          <button type="submit" className="button button-dark place-order-button" disabled={submitting}>{submitting ? "Placing your order…" : <>Place your order · ${(total / 100).toFixed(2)} <ArrowRight size={15} /></>}</button>
          <p className="form-disclaimer">By placing your order, you agree to our terms. Taxes are estimated.</p>
        </form>
        <aside className="order-summary checkout-summary"><p className="eyebrow">YOUR SELECTION</p><h2>A few <em>good things.</em></h2><div className="checkout-items">{items.map(({ product, quantity, variant }) => <div className="checkout-item" key={`${product.id}-${JSON.stringify(variant ?? {})}`}><div className="checkout-thumb">{product.images[0] ? <Image src={product.images[0]} alt="" fill sizes="38px" /> : null}<span>{quantity}</span></div><div><strong>{product.name}</strong>{variant ? <small>{Object.values(variant).join(" / ")}</small> : null}</div><span>${(product.price * quantity / 100).toFixed(2)}</span></div>)}</div><div className="summary-line"><span>Subtotal</span><span>${(subtotal / 100).toFixed(2)}</span></div><div className="summary-line"><span>Estimated tax</span><span>${(tax / 100).toFixed(2)}</span></div><div className="summary-line"><span>Shipping</span><span>{shipping ? "$8.00" : "Complimentary"}</span></div><div className="summary-total"><span>Total</span><strong>${(total / 100).toFixed(2)}</strong></div></aside>
      </div>
    </section>
  );
}

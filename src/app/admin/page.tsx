"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Boxes, CircleDollarSign, PackageCheck, Plus, RefreshCw, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/store";

type Order = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  items: { id: string; name: string; quantity: number }[];
};
type Category = { id: string; name: string; slug: string };
type ProductResponse = { products: Product[]; categories: Category[] };
type OrderResponse = { orders: Order[] };
type UserResponse = { user: { role: string; name: string } };

const orderStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);

  const loadDashboard = useCallback(async () => {
    setError("");
    try {
      const sessionResponse = await fetch("/api/auth/me");
      if (sessionResponse.status === 401) {
        router.replace("/login?next=/admin");
        return;
      }
      if (!sessionResponse.ok) throw new Error("Unable to verify your account.");
      const { user } = await sessionResponse.json() as UserResponse;
      if (user.role !== "ADMIN") {
        router.replace("/account");
        return;
      }

      const [productResponse, orderResponse] = await Promise.all([
        fetch("/api/products?limit=48&sort=newest"),
        fetch("/api/orders"),
      ]);
      if (!productResponse.ok || !orderResponse.ok) throw new Error("Unable to load your store data.");
      const productData = await productResponse.json() as ProductResponse;
      const orderData = await orderResponse.json() as OrderResponse;
      setProducts(productData.products);
      setCategories(productData.categories);
      setOrders(orderData.orders);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  async function updateOrderStatus(orderId: string, status: string) {
    setBusy(orderId);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to update this order.");
      setNotice("Order status updated.");
      await loadDashboard();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setBusy("");
    }
  }

  async function updateStock(product: Product, stock: number) {
    setBusy(product.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(product.slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to update inventory.");
      setNotice("Inventory updated.");
      await loadDashboard();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setBusy("");
    }
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy("new-product");
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          slug: form.get("slug"),
          description: form.get("description"),
          price: Math.round(Number(form.get("price")) * 100),
          stock: Number(form.get("stock")),
          categoryId: form.get("categoryId"),
          images: [form.get("image")],
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to create the product.");
      formElement.reset();
      setShowProductForm(false);
      setNotice("Your new product is live.");
      await loadDashboard();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setBusy("");
    }
  }

  if (loading) return <div className="page-loading">Opening your store dashboard…</div>;

  const pendingOrders = orders.filter((order) => order.status === "PENDING" || order.status === "PROCESSING").length;
  const revenue = orders.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.stock < 5).length;

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div><p className="eyebrow">SHOPIT CONTROL ROOM</p><h1>Your store, <em>at a glance.</em></h1><p>Products, inventory, and orders—all in one place.</p></div>
        <button className="button button-outline" onClick={() => void loadDashboard()}><RefreshCw size={14} /> Refresh</button>
      </div>
      {error ? <div className="message-box error-message">{error}</div> : null}
      {notice ? <div className="message-box success-message">{notice}</div> : null}

      <div className="admin-stats">
        <article className="admin-stat"><span className="admin-stat-icon"><CircleDollarSign size={17} /></span><span className="eyebrow">ORDER REVENUE</span><strong>${(revenue / 100).toFixed(2)}</strong><small>Excludes cancelled orders</small></article>
        <article className="admin-stat"><span className="admin-stat-icon"><ShoppingBag size={17} /></span><span className="eyebrow">ALL ORDERS</span><strong>{orders.length}</strong><small>{pendingOrders} need attention</small></article>
        <article className="admin-stat"><span className="admin-stat-icon"><Boxes size={17} /></span><span className="eyebrow">LIVE PRODUCTS</span><strong>{products.length}</strong><small>{lowStock} running low on stock</small></article>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h2>Products & <em>stock.</em></h2></div><button className="button button-dark" onClick={() => setShowProductForm((open) => !open)}><Plus size={15} /> Add product</button></div>
        {showProductForm ? <form className="admin-product-form" onSubmit={createProduct}>
          <label className="form-field"><span>PRODUCT NAME</span><input name="name" required maxLength={160} /></label>
          <label className="form-field"><span>URL SLUG</span><input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" /></label>
          <label className="form-field"><span>PRICE (USD)</span><input name="price" type="number" min="0" step="0.01" required /></label>
          <label className="form-field"><span>INITIAL STOCK</span><input name="stock" type="number" min="0" step="1" defaultValue="0" required /></label>
          <label className="form-field"><span>CATEGORY</span><select name="categoryId" required defaultValue=""><option value="" disabled>Choose a category</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
          <label className="form-field"><span>IMAGE URL</span><input name="image" type="url" required placeholder="https://…" /></label>
          <label className="form-field admin-description-field"><span>DESCRIPTION</span><textarea name="description" rows={3} required maxLength={10000} /></label>
          <div className="admin-form-actions"><button type="button" className="button button-outline" onClick={() => setShowProductForm(false)}>Cancel</button><button className="button button-dark" disabled={busy === "new-product"}>{busy === "new-product" ? "Saving…" : "Publish product"} <ArrowRight size={14} /></button></div>
        </form> : null}
        <div className="admin-product-list">
          {products.map((product) => <article className="admin-product-row" key={product.id}>
            <div className="admin-product-thumb">{product.images[0] ? <Image src={product.images[0]} alt="" fill sizes="48px" /> : null}</div>
            <div className="admin-product-name"><strong>{product.name}</strong><span>{product.category.name} · ${(product.price / 100).toFixed(2)}</span></div>
            <span className={product.stock < 5 ? "inventory-label inventory-low" : "inventory-label"}><PackageCheck size={14} />{product.stock < 1 ? "Sold out" : `${product.stock} in stock`}</span>
            <label className="stock-edit"><span className="visually-hidden">Set stock for {product.name}</span><input aria-label={`Set stock for ${product.name}`} type="number" min="0" step="1" defaultValue={product.stock} key={`${product.id}-${product.stock}`} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void updateStock(product, Number(event.currentTarget.value)); } }} /><button disabled={busy === product.id} onClick={(event) => { const input = event.currentTarget.parentElement?.querySelector("input"); if (input) void updateStock(product, Number(input.value)); }}>Save</button></label>
            <Link className="admin-view-link" href={`/products/${product.slug}`} aria-label={`View ${product.name}`}><ArrowRight size={15} /></Link>
          </article>)}
          {!products.length ? <p className="admin-empty">No products yet. Add your first product above.</p> : null}
        </div>
      </section>

      <section className="admin-panel admin-orders">
        <div className="admin-panel-heading"><div><p className="eyebrow">FULFILMENT DESK</p><h2>Customer <em>orders.</em></h2></div><span className="admin-orders-count">{orders.length} ORDERS</span></div>
        {orders.map((order) => <article className="admin-order-row" key={order.id}>
          <div className="admin-order-main"><strong>#{order.id.slice(-8).toUpperCase()}</strong><span>{order.user.name} · {order.user.email}</span><small>{new Date(order.createdAt).toLocaleDateString()} · {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</small></div>
          <strong className="admin-order-total">${(order.total / 100).toFixed(2)}</strong>
          <label className="admin-status-select"><span className="visually-hidden">Update order status</span><select aria-label={`Status for order ${order.id}`} value={order.status} disabled={busy === order.id} onChange={(event) => void updateOrderStatus(order.id, event.target.value)}>{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
        </article>)}
        {!orders.length ? <p className="admin-empty">No orders yet. Customer orders will appear here.</p> : null}
      </section>
    </section>
  );
}

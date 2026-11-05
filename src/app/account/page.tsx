"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";

type AccountData = {
  user: {
    id: string;
    name: string;
    email: string;
    addresses: { id: string; name: string; line1: string; line2: string | null; city: string; region: string; postalCode: string; country: string; isDefault: boolean }[];
    orders: { id: string; status: string; total: number; createdAt: string; items: { id: string; name: string; quantity: number }[] }[];
  };
};

export default function AccountPage() {
  const router = useRouter();
  const [data, setData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordered, setOrdered] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setOrdered(new URLSearchParams(window.location.search).get("ordered") ?? "");
    fetch("/api/auth/me")
      .then(async (response) => {
        if (response.status === 401) { router.replace("/login"); return null; }
        if (!response.ok) throw new Error("Unable to load account.");
        return await response.json() as AccountData;
      })
      .then((result) => { if (result) setData(result); })
      .catch(() => setError("We couldn't load your account. Please refresh the page."))
      .finally(() => setLoading(false));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  if (loading) return <div className="page-loading">Opening your account…</div>;
  if (error) return <div className="page-loading">{error}</div>;
  if (!data) return <div className="page-loading">Taking you to sign in…</div>;
  const { user } = data;
  return <section className="account-page"><div className="account-heading"><div><p className="eyebrow">YOUR ATELIER</p><h1>Good to have you, <em>{user.name.split(" ")[0]}.</em></h1><p>{user.email}</p></div><button className="button button-outline" onClick={logout}>Sign out <LogOut size={14} /></button></div>{ordered ? <div className="message-box success-message">Your order is in good hands. Order #{ordered.slice(-8).toUpperCase()} is confirmed.</div> : null}<div className="account-grid"><section className="account-card order-history"><div className="account-card-heading"><div><p className="eyebrow">THE PAPER TRAIL</p><h2>Your <em>orders.</em></h2></div><span>{user.orders.length} TOTAL</span></div>{user.orders.length ? user.orders.map((order) => <article className="order-row" key={order.id}><div className="order-row-top"><strong>ORDER #{order.id.slice(-8).toUpperCase()}</strong><span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span></div><p>{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} pieces</p><div className="order-row-bottom"><span>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(" · ")}</span><strong>${(order.total / 100).toFixed(2)}</strong></div></article>) : <div className="account-empty"><p>Your order history is a blank page.</p><Link className="text-button" href="/#shop">Find something meaningful <ArrowRight size={14} /></Link></div>}</section><aside className="account-card saved-addresses"><p className="eyebrow">READY WHEN YOU ARE</p><h2>Saved <em>addresses.</em></h2>{user.addresses.length ? user.addresses.map((address) => <div className="address-card" key={address.id}><strong>{address.name}{address.isDefault ? <span>DEFAULT</span> : null}</strong><p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />{address.city}, {address.region} {address.postalCode}<br />{address.country}</p></div>) : <p className="address-empty">Your shipping address will be saved here after your first order.</p>}<Link className="text-button account-shop-link" href="/#shop">Back to the good things <ArrowRight size={14} /></Link></aside></div></section>;
}

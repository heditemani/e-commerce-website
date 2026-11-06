"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Search, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export function StoreHeader() {
  const items = useCartStore((state) => state.items);
  const [user, setUser] = useState<{ name: string; role: "CUSTOMER" | "ADMIN" } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) {
        const data = (await response.json()) as { user: { name: string; role: "CUSTOMER" | "ADMIN" } };
        setUser(data.user);
      }
    }).catch(() => undefined);
  }, []);

  const count = items.reduce((total, item) => total + item.quantity, 0);
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Shopit home">
        <span className="brand-mark">S</span>
        <span>Shopit<span className="brand-period">.</span></span>
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        <Link href="/collections">Shop</Link>
        <Link href="/about">Our story</Link>
      </nav>
      <div className="header-actions">
        {user?.role === "ADMIN" ? <Link className="account-link admin-nav-link" href="/admin">Admin</Link> : null}
        <Link className="header-search-link" href="/search" aria-label="Search Shopit"><Search size={17} /></Link>
        <Link className="account-link" href={user ? "/account" : "/login"}>
          {user ? user.name.split(" ")[0] : "Account"} <ArrowUpRight size={14} />
        </Link>
        <Link className="bag-link" href="/cart" aria-label={`Shopping bag, ${count} items`}>
          <ShoppingBag size={18} /><span>Bag</span><span className="bag-count">{count}</span>
        </Link>
      </div>
    </header>
  );
}

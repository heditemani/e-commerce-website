"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export function StoreHeader() {
  const items = useCartStore((state) => state.items);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) {
        const data = (await response.json()) as { user: { name: string } };
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
        <Link href="/#shop">Shop</Link>
        <Link href="/#story">Our story</Link>
      </nav>
      <div className="header-actions">
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

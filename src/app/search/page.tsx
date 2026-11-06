"use client";

import { FormEvent, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/store";

export default function SearchPage() {
  const [term, setTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initialTerm = new URLSearchParams(window.location.search).get("q") ?? "";
    setTerm(initialTerm);
    setSubmittedTerm(initialTerm);
  }, []);

  useEffect(() => {
    if (!submittedTerm.trim()) {
      setProducts([]);
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    fetch(`/api/products?q=${encodeURIComponent(submittedTerm.trim())}&limit=48`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Search is temporarily unavailable.");
        return await response.json() as { products: Product[] };
      })
      .then((result) => { if (active) setProducts(result.products); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Something went wrong."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [submittedTerm]);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTerm = term.trim();
    window.history.replaceState(null, "", nextTerm ? `/search?q=${encodeURIComponent(nextTerm)}` : "/search");
    setSubmittedTerm(nextTerm);
  }

  return (
    <section className="search-page">
      <header className="search-heading"><p className="eyebrow">FIND SOMETHING GOOD</p><h1>A little look <em>around.</em></h1><form className="search-form" onSubmit={search}><Search size={18} /><input autoFocus aria-label="Search products" placeholder="Try “linen” or “home”" value={term} onChange={(event) => setTerm(event.target.value)} /><button className="button button-dark" type="submit">Search</button></form></header>
      {submittedTerm ? <div className="search-results-heading"><h2>Results for <em>“{submittedTerm}”</em></h2>{!loading && !error ? <span>{products.length} {products.length === 1 ? "find" : "finds"}</span> : null}</div> : <p className="search-prompt">Search across the Shopit collection.</p>}
      {loading ? <div className="loading-grid">{Array.from({ length: 4 }, (_, index) => <div className="skeleton" key={index} />)}</div> : null}
      {error ? <div className="message-box error-message">{error}</div> : null}
      {!loading && !error && products.length ? <div className="product-grid">{products.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}</div> : null}
      {!loading && !error && submittedTerm && !products.length ? <div className="empty-state"><p>No exact match yet. Try another word.</p></div> : null}
    </section>
  );
}

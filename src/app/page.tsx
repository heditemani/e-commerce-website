"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/store";

type CatalogResponse = {
  products: Product[];
  categories: { id: string; name: string; slug: string }[];
  pagination: { page: number; pages: number; total: number };
  demoMode?: boolean;
};

export default function HomePage() {
  const [data, setData] = useState<CatalogResponse | null>(null);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("popular");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: "12", sort });
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", String(Math.round(Number(minPrice) * 100)));
    if (maxPrice) params.set("maxPrice", String(Math.round(Number(maxPrice) * 100)));
    return params.toString();
  }, [category, maxPrice, minPrice, page, sort]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`/api/products?${query}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("We couldn't load the collection. Please try again.");
        return (await response.json()) as CatalogResponse;
      })
      .then((result) => { if (active) setData(result); })
      .catch((cause: unknown) => { if (active) setError(cause instanceof Error ? cause.message : "Something went wrong."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query]);

  const categories = data?.categories ?? [];
  const categoryImages: Record<string, string> = {
    "home-living": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85",
    accessories: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    apparel: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85",
  };
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker"><span className="status-dot" /> SMALL BATCH. BIG PURPOSE.</p>
          <h1>Make room<br />for <em>better.</em></h1>
          <p className="hero-description">Thoughtfully made essentials for the rituals, routines, and little moments that make a life.</p>
          <Link className="button button-dark" href="/collections">Explore the collection <ArrowRight size={16} /></Link>
          <span className="hero-note">DESIGNED WITH INTENTION · MADE TO LAST</span>
        </div>
        <div className="hero-art">
          <Image
            className="hero-photo"
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=90"
            alt="Sunlit, thoughtfully furnished living space"
            fill
            priority
            sizes="(max-width: 650px) 90vw, 48vw"
          />
          <span className="art-caption">THE SLOW LIVING EDIT<br />NO. 04 — AUTUMN / WINTER</span>
          <span className="art-index">01 / 04</span>
        </div>
        <div className="hero-bottom"><span>01 — OBJECTS WITH A POINT OF VIEW</span><ArrowDown size={16} /><span>SCROLL TO DISCOVER</span></div>
      </section>

      <section className="category-section" aria-labelledby="category-title">
        <div className="category-heading">
          <div><p className="eyebrow">A GOOD PLACE TO START</p><h2 id="category-title">Find your <em>kind of good.</em></h2></div>
          <span>THOUGHTFUL THINGS, FOR EVERYDAY LIVING</span>
        </div>
        <div className="category-grid">
          {categories.map((item, index) => (
            <a
              className={`category-tile category-tile-${index + 1}`}
              href={`/collections/${item.slug}`}
              key={item.id}
            >
              <Image src={categoryImages[item.slug] ?? categoryImages["home-living"]} alt="" fill sizes="(max-width: 650px) 90vw, 30vw" />
              <span className="category-shade" />
              <span className="category-copy"><small>THE COLLECTION</small><strong>{item.name}</strong></span>
              <span className="category-arrow"><ArrowRight size={17} /></span>
            </a>
          ))}
        </div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">THE EVERYDAY, ELEVATED</p><h2>Considered <em>goods.</em></h2></div>
          <p className="section-aside">A little less, a little better.<br />Made to become part of your everyday.</p>
        </div>
        <div className="catalog-toolbar">
          <div className="filter-label"><SlidersHorizontal size={15} /> FILTER BY</div>
          <div className="filter-controls">
            <label className="select-wrap">
              <span className="visually-hidden">Category</span>
              <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
                <option value="">All objects</option>
                {categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <label className="price-filter"><span>$</span><input aria-label="Minimum price in dollars" type="number" min="0" placeholder="Min" value={minPrice} onChange={(event) => { setMinPrice(event.target.value); setPage(1); }} /></label>
            <span className="price-dash">—</span>
            <label className="price-filter"><span>$</span><input aria-label="Maximum price in dollars" type="number" min="0" placeholder="Max" value={maxPrice} onChange={(event) => { setMaxPrice(event.target.value); setPage(1); }} /></label>
          </div>
          <label className="sort-control"><span>SORT</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="popular">Most loved</option><option value="newest">Just in</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
        </div>
        {error ? <div className="message-box error-message">{error}</div> : null}
        {data?.demoMode ? <div className="message-box demo-notice">Preview collection is active. Run <code>npm run db:setup</code> to enable accounts, inventory, and checkout.</div> : null}
        {loading ? <div className="loading-grid">{Array.from({ length: 4 }, (_, index) => <div className="skeleton" key={index} />)}</div> : null}
        {!loading && !error && data?.products.length === 0 ? <div className="empty-state"><p>No pieces found in this collection.</p><button className="text-button" onClick={() => { setCategory(""); setMinPrice(""); setMaxPrice(""); }}>Clear filters <ArrowRight size={14} /></button></div> : null}
        {!loading && !error && data?.products.length ? (
          <>
            <div className="product-grid">{data.products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div>
            {data.pagination.pages > 1 ? <div className="pagination">
              <span>{data.pagination.total} thoughtful finds</span>
              <div><button className="button button-outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span className="page-count">{page} / {data.pagination.pages}</span><button className="button button-outline" disabled={page >= data.pagination.pages} onClick={() => setPage(page + 1)}>Next</button></div>
            </div> : null}
          </>
        ) : null}
      </section>

      <section className="editorial-banner">
        <Image
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2000&q=90"
          alt="An inviting, sunlit home with natural textures"
          fill
          sizes="100vw"
        />
        <div className="editorial-overlay" />
        <div className="editorial-content">
          <p className="eyebrow">A LITTLE MORE INTENTION, EVERY DAY</p>
          <h2>Make everyday<br />feel a little <em>more yours.</em></h2>
          <a className="button button-light" href="#shop">Find your next favorite <ArrowRight size={15} /></a>
        </div>
        <span className="editorial-caption">SHOPIT JOURNAL / ISSUE NO. 01</span>
      </section>

      <section className="story-section" id="story">
        <span className="story-number">A NOTE ON BUYING BETTER / 001</span>
        <div><p className="eyebrow">LESS, BUT MEANINGFUL</p><h2>Good things<br />take <em>thought.</em></h2></div>
        <p className="story-copy">We believe the things you live with should earn their place. So we work with good people, honest materials, and makers who care about the details you can feel—even when you can’t see them.</p>
        <a className="text-button" href="/about">A little more about us <ArrowRight size={15} /></a>
      </section>
    </>
  );
}

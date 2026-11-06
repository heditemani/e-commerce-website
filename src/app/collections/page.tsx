import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { demoCategories } from "@/lib/catalog-data";

const collectionImages: Record<string, string> = {
  "home-living": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
  accessories: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1400&q=85",
  apparel: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=85",
};

export const metadata = {
  title: "Collections | Shopit",
  description: "Explore home, accessories, and apparel at Shopit.",
};

export default function CollectionsPage() {
  return (
    <section className="collections-page">
      <header className="collections-heading">
        <p className="eyebrow">THE SHOPIT EDIT</p>
        <h1>Find your <em>kind of good.</em></h1>
        <p>Thoughtful things, gathered into collections for everyday living.</p>
      </header>
      <div className="collections-list">
        {demoCategories.map((category, index) => (
          <Link className="collection-feature" href={`/collections/${category.slug}`} key={category.slug}>
            <div className="collection-feature-image">
              <Image src={collectionImages[category.slug]} alt={`${category.name} collection`} fill sizes="(max-width: 650px) 90vw, 44vw" />
            </div>
            <div className="collection-feature-copy">
              <p className="eyebrow">COLLECTION / 0{index + 1}</p>
              <h2>{category.name}</h2>
              <span>Explore the edit <ArrowRight size={15} /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";

type ContentPageProps = {
  eyebrow: string;
  title: string;
  accent: string;
  intro: string;
  image: string;
  imageAlt: string;
  sections: { title: string; paragraphs: string[] }[];
};

export function ContentPage({
  eyebrow,
  title,
  accent,
  intro,
  image,
  imageAlt,
  sections,
}: ContentPageProps) {
  return (
    <article className="content-page">
      <header className="content-page-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title} <em>{accent}</em></h1>
        <p>{intro}</p>
      </header>
      <div className="content-page-image">
        <Image src={image} alt={imageAlt} fill priority sizes="(max-width: 650px) 90vw, 86vw" />
      </div>
      <div className="content-page-sections">
        {sections.map((section, index) => (
          <section className="content-copy-section" key={section.title}>
            <span className="content-section-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ))}
        <Link className="button button-dark content-shop-link" href="/collections">Explore the collections <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

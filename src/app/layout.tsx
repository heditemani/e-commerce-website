import type { Metadata } from "next";
import Link from "next/link";
import { CartHydration } from "@/components/cart-hydration";
import { StoreHeader } from "@/components/store-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shopit — thoughtfully made, made to last",
  description: "Shopit — everyday finds and essentials for a more intentional life.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CartHydration />
        <StoreHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="footer-brand-block"><LinkText /><span>Thoughtful things, made for everyday.</span></div>
          <div className="footer-link-group"><span className="eyebrow">EXPLORE</span><Link href="/collections">Collections</Link><Link href="/about">Our story</Link><Link href="/search">Search</Link></div>
          <div className="footer-link-group"><span className="eyebrow">HERE TO HELP</span><Link href="/contact">Contact us</Link><Link href="/faq">FAQs</Link><Link href="/shipping">Shipping</Link><Link href="/returns">Returns</Link></div>
          <div className="footer-link-group"><span className="eyebrow">THE DETAILS</span><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/account">My account</Link></div>
          <div className="footer-copyright">© {new Date().getFullYear()} Shopit</div>
        </footer>
      </body>
    </html>
  );
}

function LinkText() {
  return <Link className="footer-brand" href="/">Shopit<span className="brand-period">.</span></Link>;
}

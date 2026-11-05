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
          <LinkText />
          <span>Thoughtful things, made for everyday.</span>
          <span>© {new Date().getFullYear()} Shopit</span>
        </footer>
      </body>
    </html>
  );
}

function LinkText() {
  return <Link className="footer-brand" href="/">Shopit<span className="brand-period">.</span></Link>;
}

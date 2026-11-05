import type { Metadata } from "next";
import Link from "next/link";
import { CartHydration } from "@/components/cart-hydration";
import { StoreHeader } from "@/components/store-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier — thoughtfully made, made to last",
  description: "Everyday objects and considered essentials for a more intentional life.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartHydration />
        <StoreHeader />
        <main>{children}</main>
        <footer className="site-footer">
          <LinkText />
          <span>Thoughtful things, made for everyday.</span>
          <span>© {new Date().getFullYear()} Atelier</span>
        </footer>
      </body>
    </html>
  );
}

function LinkText() {
  return <Link className="footer-brand" href="/">atelier<span className="brand-period">.</span></Link>;
}

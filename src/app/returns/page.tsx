import { ContentPage } from "@/components/content-page";

export const metadata = {
  title: "Returns and exchanges | Shopit",
  description: "Read Shopit’s return information and demo-store terms.",
};

export default function ReturnsPage() {
  return <ContentPage
    eyebrow="HERE TO HELP"
    title="Let’s make it"
    accent="right."
    intro="We want your experience to feel easy. This page explains the current demo-store return process."
    image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=85"
    imageAlt="A helpful customer service experience"
    sections={[
      { title: "A demo-store note", paragraphs: ["Shopit is currently a development demo. Orders are simulated, no payments are collected, and no physical products are shipped. This page is not a binding return or refund guarantee.", "Before using this site as a real shop, the store owner should publish a return window, eligible item conditions, return-shipping responsibilities, and refund timing."] },
      { title: "Already placed a demo order?", paragraphs: ["You can review its status from your account. For questions or to request a demo order update, contact the store team and include the order number."] },
      { title: "Talk to us", paragraphs: ["Have a question? Our contact form sends a message directly to the Shopit admin inbox."] },
    ]}
  />;
}

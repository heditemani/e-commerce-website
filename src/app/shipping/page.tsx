import { ContentPage } from "@/components/content-page";

export const metadata = {
  title: "Shipping information | Shopit",
  description: "Find shipping information for the Shopit demo store.",
};

export default function ShippingPage() {
  return <ContentPage
    eyebrow="THE PRACTICAL DETAILS"
    title="Shipping, made"
    accent="simple."
    intro="Here’s how delivery works in the current Shopit demo."
    image="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=85"
    imageAlt="Carefully wrapped parcels ready for delivery"
    sections={[
      { title: "Shipping rates", paragraphs: ["The checkout currently estimates shipping at $8. Orders with a subtotal of $100 or more qualify for complimentary shipping.", "These are demo settings for this starter store, not a live delivery commitment."] },
      { title: "Order processing", paragraphs: ["Orders placed here are for demonstration. No parcel is prepared, dispatched, or tracked.", "In a live store, you can update fulfillment status in the admin dashboard and customers can check it from their account."] },
      { title: "Need a hand?", paragraphs: ["If you have questions about a demo order, send us a message through the contact page and include your order number."] },
    ]}
  />;
}

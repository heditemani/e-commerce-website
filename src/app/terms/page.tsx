import { ContentPage } from "@/components/content-page";

export const metadata = {
  title: "Terms of use | Shopit",
  description: "Read the terms for using the Shopit demo storefront.",
};

export default function TermsPage() {
  return <ContentPage
    eyebrow="THE SMALL PRINT"
    title="Terms of"
    accent="use."
    intro="These notes describe the current Shopit demonstration site."
    image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=85"
    imageAlt="Documents on a desk"
    sections={[
      { title: "A demonstration storefront", paragraphs: ["Shopit is provided as a demo e-commerce application. Product availability and order fulfillment are simulated. No real payment is taken and no order is shipped.", "Prices, tax estimates, shipping charges, and policy text are example values that must be reviewed before a real store launch."] },
      { title: "Accounts and access", paragraphs: ["Keep your sign-in details secure. Public registration creates customer accounts only; administrator access is restricted to store-managed accounts.", "Do not submit payment-card data or sensitive information through this demo."] },
      { title: "Before going live", paragraphs: ["The business operating a production store should replace these demo terms with legal terms appropriate to its services and location. These notes are not legal advice."] },
    ]}
  />;
}

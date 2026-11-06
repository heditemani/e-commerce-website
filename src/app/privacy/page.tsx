import { ContentPage } from "@/components/content-page";

export const metadata = {
  title: "Privacy information | Shopit",
  description: "Learn what information the Shopit demo uses and stores.",
};

export default function PrivacyPage() {
  return <ContentPage
    eyebrow="YOUR INFORMATION, RESPECTED"
    title="Privacy"
    accent="matters."
    intro="A plain-language overview of information handled by this local Shopit demo."
    image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=85"
    imageAlt="A laptop on a desk, representing online privacy"
    sections={[
      { title: "Information you provide", paragraphs: ["If you create an account, Shopit stores the name, email, and hashed password you provide in its configured database. During demo checkout, shipping details and order information are saved to display order history.", "The contact form stores your name, email, subject, and message so an administrator can read and manage the inquiry."] },
      { title: "How this demo uses it", paragraphs: ["Account information is used to sign you in and show your account. Shipping and order details are used for the simulated checkout. Contact details are used to reply to a message.", "The cart is saved in browser local storage. A signed, httpOnly session cookie keeps the account signed in."] },
      { title: "Demo limitations", paragraphs: ["This is starter-site privacy information, not legal advice or a complete privacy notice. Before public launch, configure retention, deletion, analytics, payment, and applicable privacy-rights processes for your business and region.", "To request removal of a demo account or message, use the contact page."] },
    ]}
  />;
}

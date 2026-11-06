import Link from "next/link";

export const metadata = {
  title: "Frequently asked questions | Shopit",
  description: "Answers to common Shopit shopping, checkout, and account questions.",
};

const questions = [
  { question: "How do I place an order?", answer: <>Browse a collection, choose a product, and add it to your bag. To complete checkout, create an account or sign in and add your shipping details.</> },
  { question: "What payment methods can I use?", answer: <>Checkout is currently a demo flow. It records an order but does not charge a payment method. Please don’t enter card details.</> },
  { question: "How much is shipping?", answer: <>The current demo estimates shipping at $8, with complimentary shipping for orders over $100. These settings are examples and can change before launch.</> },
  { question: "How can I check my order status?", answer: <>Sign in and open your <Link href="/account">account page</Link> to see your order history and status updates.</> },
  { question: "Can I update or cancel my order?", answer: <>Send us a message from the <Link href="/contact">contact page</Link> with your order number. Orders are only a demo and aren’t being shipped yet.</> },
  { question: "How do I create an account?", answer: <>Choose Account in the top navigation, then select “Create an account.” Your account lets you review demo orders and saved shipping addresses.</> },
  { question: "Where can I find your return policy?", answer: <>Read our <Link href="/returns">returns page</Link> for the current demo guidance. A real store policy should be confirmed before launch.</> },
  { question: "How do I contact Shopit?", answer: <>Use our <Link href="/contact">contact form</Link>. We’ll receive your message in the store admin inbox.</> },
];

export default function FAQPage() {
  return <section className="faq-page">
    <header className="faq-heading"><p className="eyebrow">A FEW HELPFUL THINGS</p><h1>Good questions, <em>answered.</em></h1><p>Can’t find what you’re looking for? <Link href="/contact">Send us a note.</Link></p></header>
    <div className="faq-list">{questions.map((item, index) => <details className="faq-item" key={item.question}><summary><span className="faq-number">0{index + 1}</span><strong>{item.question}</strong><span className="faq-plus" aria-hidden="true">+</span></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div>
  </section>;
}

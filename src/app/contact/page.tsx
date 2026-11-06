"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Check, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          subject: form.get("subject"),
          message: form.get("message"),
          website: form.get("website"),
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "We couldn't send your message.");
      formElement.reset();
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <section className="contact-page">
    <header className="contact-heading"><p className="eyebrow">WE’RE HERE TO HELP</p><h1>Let’s have a <em>conversation.</em></h1><p>A question about a piece, your account, or an order? Send us a note and we’ll get back to you.</p></header>
    <div className="contact-layout">
      <aside className="contact-aside"><div className="contact-aside-icon"><MessageCircle size={20} /></div><h2>A real note goes a long way.</h2><p>Your message is delivered straight to the Shopit admin inbox. For order questions, include your order number so we can help.</p><div className="contact-detail"><Mail size={15} /><span>Messages are usually answered within 1–2 business days.</span></div><p className="contact-faq-link">Looking for a quick answer? <Link href="/faq">Visit the FAQ <ArrowRight size={13} /></Link></p></aside>
      <div className="contact-form-wrap">
        {submitted ? <div className="contact-success"><span><Check size={19} /></span><p className="eyebrow">NOTE RECEIVED</p><h2>Thanks for reaching <em>out.</em></h2><p>Your message is in our inbox. We’ll be in touch soon.</p><button className="text-button" onClick={() => setSubmitted(false)}>Send another message <ArrowRight size={14} /></button></div> : <form className="contact-form" onSubmit={sendMessage}>
          <label className="form-field"><span>YOUR NAME</span><input name="name" required maxLength={100} autoComplete="name" /></label>
          <label className="form-field"><span>EMAIL ADDRESS</span><input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
          <label className="form-field"><span>WHAT’S THIS ABOUT?</span><input name="subject" required minLength={2} maxLength={140} placeholder="Order question, product detail…" /></label>
          <label className="form-field"><span>YOUR MESSAGE</span><textarea name="message" rows={6} required minLength={10} maxLength={5000} placeholder="Tell us a little more…" /></label>
          <label className="contact-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
          {error ? <div className="message-box error-message">{error}</div> : null}
          <button className="button button-dark contact-submit" disabled={submitting}>{submitting ? "Sending your note…" : <>Send your note <ArrowRight size={15} /></>}</button>
        </form>}
      </div>
    </div>
  </section>;
}

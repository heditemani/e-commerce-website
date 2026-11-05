"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch(`/api/auth/${registering ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(registering ? { name } : {}), email, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Unable to sign in.");
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") ? next : "/account");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return <section className="auth-page"><div className="auth-art"><span>SHOPIT NOTES / 01</span><div className="auth-art-copy"><p className="eyebrow">A GOOD PLACE TO BEGIN</p><h2>Keep the things<br />that <em>matter.</em></h2><p>Your orders, saved addresses, and considered finds—together in one place.</p></div><span>MADE FOR THE WAY YOU LIVE</span></div><div className="auth-panel"><p className="eyebrow">{registering ? "NEW AROUND HERE?" : "GOOD TO SEE YOU"}</p><h1>{registering ? "Make yourself at home." : "Welcome back."}</h1><p className="auth-intro">{registering ? "A few details and you're in." : "Your little corner of Shopit awaits."}</p><form className="auth-form" onSubmit={submit}>{registering ? <label className="form-field"><span>YOUR NAME</span><input required autoComplete="name" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} /></label> : null}<label className="form-field"><span>EMAIL ADDRESS</span><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="form-field"><span>PASSWORD <i>{registering ? "10 CHARACTERS MIN." : ""}</i></span><input required type="password" minLength={registering ? 10 : 1} autoComplete={registering ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error ? <div className="message-box error-message">{error}</div> : null}<button className="button button-dark auth-submit" disabled={submitting}>{submitting ? "One moment…" : registering ? "Create your account" : "Sign in"} <ArrowRight size={15} /></button></form><p className="auth-switch">{registering ? "Already have an account?" : "New to Shopit?"} <button className="text-button" onClick={() => { setError(""); setRegistering((value) => !value); }}>{registering ? "Sign in" : "Create an account"}</button></p><Link className="auth-back" href="/">← Back to the collection</Link></div></section>;
}

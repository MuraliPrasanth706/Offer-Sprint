"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null as { error?: string } | null);
  return (
    <main className="login">
      <form action={action} className="card form">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10, marginBottom: 4 }}>
          <span className="logo" aria-hidden="true" style={{ width: 48, height: 48, borderRadius: 13 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
          </span>
          <div>
            <h1 style={{ fontSize: 24 }}>Offer Sprint</h1>
            <p className="muted small" style={{ margin: "4px 0 0" }}>Oct 20 → Dec 20, 2026</p>
          </div>
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoFocus required autoComplete="current-password" />
        </div>
        {state?.error && <p className="error">{state.error}</p>}
        <button className="primary" disabled={pending}>{pending ? "Checking…" : "Log in"}</button>
      </form>
    </main>
  );
}

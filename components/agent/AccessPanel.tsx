"use client";
// components/agent/AccessPanel.tsx — unlock the agent's paid features with a purchase (PayPal order
// number or Gumroad license key), checked with the payment provider: the interview coach
// (packages 2–4) and AI drafting and sending (packages 3–4).

import { useId, useState } from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { useAgent } from "./context";
import { Notice } from "./parts";

export default function AccessPanel({ compact = false }: { compact?: boolean }) {
  const { t, access, usage, verifyAccess, forgetAccess, status, pkg } = useAgent();
  const [proof, setProof] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  const check = async () => {
    setBusy(true);
    setError(null);
    const err = await verifyAccess(proof);
    setBusy(false);
    if (err) setError(err);
    else setProof("");
  };

  const name = access ? (access.tier ? pkg.name(access.tier) : access.plan ? t.access.plans[access.plan] : "") : "";
  const coach = Boolean(access?.coach || access?.plan); // access saved before 23 Oct 2026 was Pro, which includes the coach

  return (
    <section className="za-panel za-access" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="za-h2">{t.access.h}</h2>
      {access ? (
        <>
          <Notice tone="ok">{t.access.ok(name, access.ref)}</Notice>
          <ul className="za-features">
            <li data-on={coach}>{coach ? <Check size={16} aria-hidden /> : <Minus size={16} aria-hidden />}<span>{t.access.features.coach}</span><em>{coach ? t.access.features.yes : t.access.features.no}</em></li>
            <li data-on={Boolean(access.plan)}>{access.plan ? <Check size={16} aria-hidden /> : <Minus size={16} aria-hidden />}<span>{t.access.features.pro}</span><em>{access.plan ? t.access.features.yes : t.access.features.no}</em></li>
          </ul>
          {usage && access.plan && (
            <ul className="za-usage">
              <li>{t.ws.usage(usage.drafts)}</li>
              <li>{t.ws.sendsLeft(usage.sends)}</li>
            </ul>
          )}
          {access.plan && status && !status.ai && <p className="za-muted">{t.status.aiOff}</p>}
          <button type="button" className="za-textlink" onClick={() => forgetAccess()}>{t.access.forget}</button>
        </>
      ) : (
        <>
          <p className="za-body-text">{t.access.body(pkg.coach, pkg.pro)}</p>
          {!compact && <p className="za-muted">{t.access.how}</p>}
          <div className="za-field">
            <label htmlFor={id}>{t.access.field}</label>
            <div className="za-inline">
              <input
                id={id}
                className="za-input"
                value={proof}
                onChange={e => { setProof(e.target.value); setError(null); }}
                onKeyDown={e => { if (e.key === "Enter" && proof.trim()) { e.preventDefault(); void check(); } }}
                autoComplete="off"
                spellCheck={false}
                aria-describedby={compact ? `${id}-how` : undefined}
              />
              <button type="button" className="z-btn z-btn-quiet z-btn-small" disabled={busy || !proof.trim()} onClick={() => void check()}>
                {busy ? t.access.checking : t.access.check}
              </button>
            </div>
            {compact && <p id={`${id}-how`} className="za-hint">{t.access.how}</p>}
          </div>
          {error && <Notice tone="error">{error}</Notice>}
          <p><Link href="/#packages" className="za-textlink">{t.access.packages}</Link></p>
        </>
      )}
    </section>
  );
}

"use client";
// components/agent/AccessPanel.tsx — unlock AI drafting and sending with a purchase
// (PayPal order number or Gumroad license key), checked with the payment provider.

import { useId, useState } from "react";
import Link from "next/link";
import { useAgent } from "./context";
import { Notice } from "./parts";

export default function AccessPanel({ compact = false }: { compact?: boolean }) {
  const { t, access, usage, verifyAccess, forgetAccess, status } = useAgent();
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

  return (
    <section className="za-panel za-access" aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="za-h2">{t.access.h}</h2>
      {access ? (
        <>
          <Notice tone="ok">{t.access.ok(t.access.plans[access.plan], access.ref)}</Notice>
          {usage && (
            <ul className="za-usage">
              <li>{t.ws.usage(usage.drafts)}</li>
              <li>{t.ws.sendsLeft(usage.sends)}</li>
            </ul>
          )}
          {status && !status.ai && <p className="za-muted">{t.status.aiOff}</p>}
          <button type="button" className="za-textlink" onClick={() => forgetAccess()}>{t.access.forget}</button>
        </>
      ) : (
        <>
          <p className="za-body-text">{t.access.body}</p>
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

"use client";

// Shared by the concept sites: the enquiry form. It posts to /api/showcase-enquiry, which emails
// Zenith Dubai. The business on the site is fictional, so the message is a lead for Zenith.

import { useState, type ReactNode } from "react";

export type EnquiryLabels = {
  name: string;
  email: string;
  interest: string;
  message: string;
  send: string;
  sending: string;
  sent: string;
  errs: Record<string, string>;
};

export function EnquiryForm({
  site,
  lang,
  labels,
  prefix,
  interestOptions,
  footnote,
}: {
  site: string;
  lang: string;
  labels: EnquiryLabels;
  prefix: string;
  interestOptions?: string[];
  footnote?: ReactNode;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [err, setErr] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    setErr("");
    setState("sending");
    try {
      const r = await fetch("/api/showcase-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, site, lang }),
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (r.ok && j.ok) setState("sent");
      else {
        setErr(labels.errs[j.error ?? "unavailable"] ?? labels.errs.unavailable);
        setState("idle");
      }
    } catch {
      setErr(labels.errs.unavailable);
      setState("idle");
    }
  }
  if (state === "sent")
    return (
      <p className={`${prefix}-sent`} role="status">
        {labels.sent}
      </p>
    );
  return (
    <form className={`${prefix}-form`} onSubmit={submit} noValidate>
      <label>
        <span>{labels.name}</span>
        <input name="name" autoComplete="name" required maxLength={120} />
      </label>
      <label>
        <span>{labels.email}</span>
        <input name="email" type="email" autoComplete="email" required maxLength={200} />
      </label>
      <label>
        <span>{labels.interest}</span>
        {interestOptions ? (
          <select name="interest" defaultValue={interestOptions[0]}>
            {interestOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input name="interest" maxLength={80} />
        )}
      </label>
      <label className={`${prefix}-form-wide`}>
        <span>{labels.message}</span>
        <textarea name="message" rows={3} maxLength={2000} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="kit-hp" aria-hidden />
      {err && (
        <p className={`${prefix}-err`} role="alert">
          {err}
        </p>
      )}
      <button type="submit" className={`${prefix}-btn ${prefix}-btn-solid`} disabled={state === "sending"}>
        {state === "sending" ? labels.sending : labels.send}
      </button>
      {footnote}
    </form>
  );
}

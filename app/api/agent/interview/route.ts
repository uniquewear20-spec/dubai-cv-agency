// app/api/agent/interview/route.ts — the interview coach (packages 2–4). The built-in interviewer
// runs here, so the question bank and the scoring rules stay on the server; the browser keeps the
// session and sends it back with each answer. Every call checks the purchase with PayPal or Gumroad
// (cached for 15 minutes per server instance). No AI service is called, and nothing about the
// session is stored or logged here.
//
//   POST { action: "start",  access, setup, candidate, history }  → { state }
//   POST { action: "answer", access, state, input }                → { state }
//   POST { action: "report", access, state, uiLang, early? }       → { state, report }

import type { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { AccessError, verifyCoach } from "@/lib/agent/access";
import { allow, clientIp, firstTime, wasMarked } from "@/lib/agent/limits";
import { fail, ok, readJson } from "@/lib/agent/http";
import { answerTurn, endEarly, startInterview } from "@/lib/agent/interview/engine";
import { buildReport } from "@/lib/agent/interview/report";
import { parseCandidate, parseHistory, parseInput, parseSetup, parseState } from "@/lib/agent/interview/state";

export const maxDuration = 15;

type Body = {
  action?: unknown; access?: { kind?: unknown; proof?: unknown };
  setup?: unknown; candidate?: unknown; history?: unknown; state?: unknown; input?: unknown; uiLang?: unknown; early?: unknown;
};

// Per visitor, per 10 minutes: an 8-question interview with follow-ups takes about 20 answers.
const LIMITS = { start: 12, answer: 150, report: 30 } as const;

export async function POST(req: NextRequest) {
  const body = await readJson<Body>(req, 120_000);
  const action = body?.action === "start" || body?.action === "answer" || body?.action === "report" ? body.action : null;
  if (!body || !action) return fail("invalid");
  if (!allow(`iv-${action}`, clientIp(req.headers), LIMITS[action], 10 * 60_000)) return fail("Too many requests. Wait a few minutes and try again.", 429);

  const kind = body.access?.kind === "paypal" || body.access?.kind === "gumroad" || body.access?.kind === "trial" ? body.access.kind : null;
  const proof = typeof body.access?.proof === "string" ? body.access.proof.trim().slice(0, 64) : "";
  if (!kind || !proof) return fail("not-eligible");

  if (kind === "trial") {
    // The free trial: one interview per connection every 30 days, its session open for 20 minutes.
    if (!/^[a-z0-9-]{16,64}$/i.test(proof)) return fail("invalid");
    if (action === "start") {
      if (body.setup && typeof body.setup === "object") (body.setup as { length?: number }).length = 5;
      if (!(await firstTime(`iv-trial-ip:${clientIp(req.headers)}`, 30 * 86400))) return fail("trial-used");
      await firstTime(`iv-trial:${proof}`, 20 * 60);
    } else if (!(await wasMarked(`iv-trial:${proof}`))) return fail("trial-ended");
  } else {
    try {
      await verifyCoach({ kind, proof });
    } catch (err) {
      if (err instanceof AccessError) return fail(err.code);
      console.error("[agent/interview] access check failed:", err instanceof Error ? err.message : "unknown");
      return fail("unavailable");
    }
  }

  if (action === "start") {
    const setup = parseSetup(body.setup);
    if (!setup) return fail("invalid");
    const state = startInterview(setup, parseCandidate(body.candidate), parseHistory(body.history), randomUUID());
    return ok({ state });
  }

  const state = parseState(body.state);
  if (!state) return fail("invalid");

  if (action === "answer") {
    const input = parseInput(body.input);
    if (!input) return fail("invalid");
    return ok({ state: answerTurn(state, input) });
  }

  const uiLang = body.uiLang === "fr" || body.uiLang === "ar" ? body.uiLang : "en";
  const final = body.early === true ? endEarly(state) : state;
  return ok({ state: final, report: buildReport(final, uiLang) });
}

export async function GET() {
  return fail("Method not allowed.", 405);
}

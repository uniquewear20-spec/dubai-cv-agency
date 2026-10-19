# Zenith AI Career Automation: what is built, and what is still needed

Last updated: 19 October 2026.

## What is on the website now

The homepage has a new section, **Zenith AI Career Automation**, placed directly after the portfolio-websites
exhibition (`#websites`) and before *Disciplines* (`#disciplines`). It is a **front end and a launch list**.

| Part | Status |
|---|---|
| Introduction, positioning, calls to action | Live |
| Ink Orbit drawings (engine, connections, chart) | Live, labelled as an interactive preview. Nothing on them is connected. |
| How it works, candidate control, FAQ | Live, written to match what is *planned*, not what exists |
| Plans (Starter 100, Professional 500, Executive 1,000, Gold) | Shown as **proposed**. No prices, and checkout is disabled. |
| Launch-list form | **Working.** It sends an email to the Zenith inbox through the existing `/api/contact` route. |
| Accounts, CV upload, job discovery, AI writing, email sending, tracking, payments | **Not built.** Nothing on the site creates an account, contacts an employer or takes payment for these plans. |

Every call to action in the section (the main button and each plan's button) opens the launch-list form, with
the plan pre-selected when it comes from a plan. Joining does not create an account, start a campaign or send an
application, and the form says so.

## Files

| File | What it is |
|---|---|
| `components/sections/ai-career-automation.tsx` | The section, with all its copy in English, French and Arabic. |
| `components/ui/ink-orbit-features.tsx` | The Ink Orbit features component, adapted from the supplied `ink-orbit-features.tsx` (see below). |
| `lib/zenith-ai/plans.ts` | Plan structure: allowances, `price: null`, `status: "proposed"`, `checkout: false`. |
| `lib/zenith-ai/preview-data.ts` | The chart's **illustrative** weekly data. Not customer data. |
| `lib/zenith-ai/contracts.ts` | TypeScript contracts for the future backend: application states, receipts, email grants, entitlements. |
| `app/page.tsx` | Renders the section right after `<PortfolioShowcase />`. It is loaded with `next/dynamic`, so its code ships as a separate file instead of growing the homepage's main bundle; it is still rendered on the server. |
| `app/api/contact/route.ts` | Now escapes visitor input in the HTML email, limits lengths, and drops submissions that fill the hidden spam-trap field. |

### Changes made to the supplied component

- **It did not compile.** The title parser's regular expression and the default title string had real line
  breaks pasted into them. The copy now comes in as props, so that code is gone.
- **The brand.** "NeuraForge AI" and its N glyph became Zenith AI, with the flame traced from the site's own
  logo.
- **No invented activity.** The original's "REPORT #134" counter rose forever, and its chart showed a
  "pred +164%" forecast. Both are gone. The drawings now show document types being prepared, and the chart uses
  sample data labelled as illustrative.
- **Integrations.** The original showed spreadsheet, drive, docs and search tools. That integrations hub became
  "connections": your profile, your email (by OAuth permission), supported job sources, employer portals (where
  supported) and the tracker (in development). Each says what it depends on, and no third-party logos are used.
- **Theme and direction.** Light and dark follow the site's switch rather than the OS setting, in the Zenith
  palette. Every drawing and the chart mirror for Arabic.
- **Accessibility.** The stages are a keyboard tablist. Connections are buttons, with a live detail panel. The
  chart is a keyboard slider with a table view. Motion can be paused and pauses off-screen. With reduced motion it
  is not drawn at all.
- **Technical clean-up.** SVG ids are unique per instance. Styles are scoped (`.io-*`) and React adds them to
  the page once.

## Publishing prices later

1. Agree each plan's price and terms.
2. In `lib/zenith-ai/plans.ts`, set `price: { aed: <amount> }` and `status: "approved"` for that plan. The page
   then shows the price in the visitor's chosen currency.
3. Leave `checkout: false` until everything under "Payments" below exists. The section never takes payment
   while it is false.
4. **Gold** can't open until its service period, fair-use policy, eligibility criteria and renewal conditions
   are written and approved. Until then it stays "proposed" and its button only registers interest.

## What must exist before taking payments or sending applications

| Area | What it needs | Decision or credential required |
|---|---|---|
| Accounts and sessions | An auth provider, secure sessions, email verification, account deletion. | Choose the provider. |
| CV upload and processing | Private file storage, virus scanning, PDF/DOCX parsing, a retention schedule. | Storage provider; retention period. |
| Candidate profile | A database for profile and `CampaignSettings` (roles, countries, salary, exclusions, weekly limit, review-before-send, pause). | Database provider. |
| Job discovery | **Only sources whose terms permit it**: official job APIs and feeds, employer career-site APIs, licensed data. No scraping behind logins. | Source agreements or API keys. |
| Relevance and duplicates | Scoring each opening against the candidate's own criteria, and duplicate detection across sources. | Model or provider choice. |
| CV and cover-letter drafting | A server-side AI model that may use **only** facts the candidate supplied or approved, plus a review step. | AI provider and its key, kept server-side only. |
| Email authorization | **Gmail:** sending needs the `gmail.send` scope, which Google classes as *sensitive* and which needs OAuth app verification. Reading replies needs a *restricted* scope such as `gmail.readonly` or `gmail.metadata`; that needs restricted-scope verification, plus a security assessment if the data is stored or sent through your servers. **Microsoft:** an app registration with delegated Graph permissions (`Mail.Send`; `Mail.Read` only if response tracking is on). Tokens are stored encrypted on the server. Revocation is detected and handled. | Google Cloud and Microsoft Entra app registrations; the verification process. |
| Submission | Email only where the employer accepts email applications. Employer systems only through APIs or partnerships that allow it. Anything with a CAPTCHA, an assessment or an account login goes back to the candidate. **Never bypass security checks.** | Which channels to support. |
| Sending limits and compliance | Provider sending quotas, each candidate's weekly limit, spacing between sends, honouring employer instructions, and anti-spam rules. | Default limits. |
| Application history and status | The states in `contracts.ts`. **"Submitted" only with a receipt from the channel** (a message id or a portal reference). Responses and interviews are recorded separately. | None. |
| Background work | A job queue with retries, idempotency and failure handling, so nothing is sent twice. | Queue provider. |
| Allowances and entitlements | Count confirmed submissions only (`countsTowardAllowance`). Stop sending at zero. Gold uses a service period. | Plan terms. |
| Payments | Server-side order creation and verified payment webhooks. The site already uses PayPal for CV services (`lib/checkout`), and that flow can be extended. Entitlements are granted only after a verified capture. Refund terms are updated. | Approved prices; webhook secrets set in Vercel, never in code. |
| Consent, privacy, retention, deletion | Update the privacy policy, since it currently covers CV services only. Add data-processing agreements with processors, separate consent for response tracking, consent records, a working data-deletion request, and a retention schedule. Note the UAE PDPL, and the GDPR for EU candidates. | Legal review. |
| Terms of service | What the service does and does not do, no guarantee of employment, the candidate's responsibility for accuracy, and limits of liability. | Legal review. |

## Checks run for this change

- `npx tsc --noEmit`: passes.
- `npx eslint` on every new or changed file: no findings in the new files. `app/page.tsx` still has five
  lint errors that were already in the committed version before this change (`set-state-in-effect` and
  `no-unescaped-entities`); they were left as they were.
- `npm run build`: passes.
- Browser checks (Playwright, Chromium) at 1440×900, 820×1180 and 390×844, in English, French and Arabic, light
  and dark:
  - The section follows `#websites` and precedes `#disciplines`.
  - No horizontal overflow and no page errors.
  - The keyboard works for the stage tabs, the chart and the FAQ.
  - Pause campaign, revoke and reconnect all work.
  - The table view works.
  - The main button focuses the form, and a plan's button pre-selects that plan.
  - Validation messages appear, the honeypot stays empty, and the failure path offers WhatsApp.
  - With reduced motion, there are no moving parts.
- Production, on zenithdubaicv.com after the deployment of commit `5a2d357` (desktop browser, 19 October 2026):
  the section is live between `#websites` and `#disciplines`, the gallery starts with Awa Ndiaye and has Wasim
  Akram eighth, the console shows no errors, and nothing overflows sideways at 1024 px.
- **Not tested:** real phones and Safari, and a real email delivered through `/api/contact`. The local run has
  no SMTP credentials, so the success path was checked with a mocked response.

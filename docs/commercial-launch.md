# Commercial launch: what is live, and what the owner still has to do

Last updated: 22 October 2026.

## Live on zenithdubaicv.com

- Four packages (CV Essentials AED 179, Career Advantage AED 299, Career Automation AED 449, Executive Career
  Suite AED 899), priced in `lib/checkout/catalog.ts` and charged by PayPal in USD at 3.6725.
- PayPal checkout: the server creates the order at the catalog price, captures it on the confirmation page,
  and only then marks it paid. Customer and admin emails are sent by whichever path captured the payment.
- Gumroad checkout for every package, at the same US dollar prices (published and checked on 22 October 2026):

  | Package | Gumroad page | Price | Ebook PDF | License key (agent Pro) |
  |---|---|---|---|---|
  | CV Essentials | https://zenithdubaicv.gumroad.com/l/cv-essentials | US$48.74 | no | no |
  | Career Advantage | https://zenithdubaicv.gumroad.com/l/career-advantage | US$81.42 | yes | no |
  | Career Automation | https://zenithdubaicv.gumroad.com/l/career-automation | US$122.26 | yes | yes, product id `fXzEa7lD_kUyi8-7elslzw==` |
  | Executive Career Suite | https://zenithdubaicv.gumroad.com/l/executive-career-suite | US$244.79 | yes | yes, product id `POC2Tb9C8IkI7KYA3Jdc-g==` |

  Each product has the 7-day refund policy with fine print, a cover and thumbnail, a description that matches the
  site (including what is not included, and for packages 3 and 4 how the AI is used), a download page with the
  next steps, and a receipt message linking to the brief form. Product ids are public identifiers, not secrets.
- Apple Pay and Google Pay: offered through Gumroad's checkout. Gumroad's buyer guide lists "Apple and Google
  Pay" among accepted payment methods; they appear only on devices and browsers that support them. The site says
  so in text, without wallet logos. Not yet seen on a buyer's phone (owner action 9).
- Brief form after payment (`/order/brief/`), checked with PayPal; Gumroad buyers give their order number.
- Confirmation page states: paid, under review, refunded, not completed, declined, unknown.
- The Global Horizon ebook in packages 2–4: on Gumroad the PDF is on the download page right after payment; for
  PayPal orders the admin email reminds you to send the PDF (it is not stored on the website).
- Zenith AI job agent at `/agent` (see `docs/zenith-ai-agent.md`). Pro unlocks with a PayPal order number or a
  Gumroad license key from Career Automation or Executive Career Suite.
- Privacy policy, terms (deferring to the 7-day refund policy) and refund policy, in EN/FR/AR.
- robots.txt, sitemap.xml, Open Graph image.

## Email from the site (contact form, order emails, briefs, agent sending)

On 22 October 2026 the one authorised test message through the live contact form failed ("Failed to send
email"), so nothing reached the inbox. The site was sending through GoDaddy's SMTP server
(smtpout.secureserver.net), but zenithdubaicv.com's mailbox is hosted by Microsoft 365 (its MX record is
zenithdubaicv-com.mail.protection.outlook.com), which only accepts logins on smtp.office365.com, port 587. Every
email path now uses one mailer (`lib/email.ts`) with that as the default. `GET /api/agent/status/?check=email`
logs in without sending anything and reports `emailCheck` (cached 15 minutes). See owner action 0 for the result
and what to change.

## Owner actions (only you can do these)

| # | Action | Why | Where |
|---|---|---|---|
| 1 | Create the PayPal webhook and add `PAYPAL_WEBHOOK_ID` in Vercel | Captures payments when a buyer closes the tab before the confirmation page, and reports refunds and disputes. Until set, `/api/paypal/webhook/` answers 503. | developer.paypal.com → Apps & Credentials → live app → Add webhook: `https://zenithdubaicv.com/api/paypal/webhook/`, events CHECKOUT.ORDER.APPROVED, PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED, PAYMENT.CAPTURE.REFUNDED, PAYMENT.CAPTURE.REVERSED |
| 2 | Decide on AI drafting and, if yes, add `ANTHROPIC_API_KEY` in Vercel | Switches on AI drafts for Career Automation and Executive Career Suite. Paid per use (Anthropic API). | console.anthropic.com → API keys. Optional `ANTHROPIC_MODEL`. Never paste the key in chat or code. |
| 3 | Approve or change the agent allowances | Defaults: 30 AI drafts per Career Automation order, 20 a day for Executive Career Suite, 10 emails a day. Not published on the marketing pages or on Gumroad until you approve. | Vercel env: `AGENT_AI_DRAFTS_CAREER_AUTOMATION`, `AGENT_AI_DRAFTS_EXECUTIVE_SUITE_PER_DAY`, `AGENT_SENDS_PER_DAY` |
| 4 | Optional: connect Upstash Redis (Vercel KV) | Counts allowances across all server instances (now counted per instance). | Vercel → Storage → KV / Upstash; it adds `KV_REST_API_URL` and `KV_REST_API_TOKEN` |
| 5 | Optional: request a Jooble API key | Adds on-site jobs, including the Gulf, to the agent's search. | jooble.org/api/about → `JOOBLE_API_KEY` in Vercel |
| 6 | Optional: Adzuna keys, after reading their API terms | 19 more countries (not the Gulf). | developer.adzuna.com → `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` |
| 7 | Add your legal business name and address to the privacy policy and terms | The old pages said "a company based in Dubai, UAE"; that wasn't verifiable, so it was left out. The governing-law clause (UAE law, Dubai courts) is unchanged and assumes a UAE presence. | `lib/legal/docs.ts` |
| 8 | Confirm the standalone price of The Global Horizon | Listed on Gumroad at US$24, pay what you want (minimum US$24). Not shown on the site. | Gumroad → Products → The Global Horizon |
| 9 | Check Apple Pay and Google Pay on a phone, signed out of Gumroad | Gumroad documents both, but they were not seen on a real device here: while signed in as the seller, Gumroad turns checkout into a free test purchase and hides the payment methods. | iPhone in Safari with a card in Apple Wallet, and Android in Chrome with Google Pay: open a package's Gumroad page, tap "Buy this", check the wallet button, stop before paying |
| 10 | Make one test purchase while signed in to Gumroad (not charged) | Confirms the receipt message, ebook download and license key end to end; then paste the key at zenithdubaicv.com/agent to check that Pro unlocks. Gumroad shows a reCAPTCHA at checkout, which only you can complete. | Career Automation's Gumroad page |
| 11 | Choose the support email on Gumroad receipts | Receipts say "Contact Zenith Dubai at" the Gumroad account's email. If customers should write to info@zenithdubaicv.com, change it in Gumroad's settings. Not changed for you (account setting). | Gumroad → Settings |
| 12 | Decide whether to keep tips | Gumroad's checkout offers "Add a tip?" on these service packages. Not changed for you (account setting). | Gumroad → Settings |

## Decisions that were not taken for you

- AI usage allowances (item 3) and whether to pay for AI drafting at all (item 2).
- Whether to keep the agent's free tools open to everyone (they are, today: job search, ranking, template drafts,
  tracker). Remotive's terms forbid collecting sign-ups to show its listings, so search should stay sign-up free.
- The ebook's standalone price (item 8), your legal entity details (item 7), the receipt support email (item 11)
  and tips (item 12).
- `.co` domain: not registered, not configured, not bought.

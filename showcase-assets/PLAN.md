# Concept websites: production plan

Approved by Abdell on 26 Nov 2026 ("now 98 left. i want the best and advanced websites same like this").
Built: Halo Ridge (real estate), TIFAWT (beauty). Remaining: 98, at the TIFAWT bar.

## The bar (every site)

- Its own fictional brand: name, logo, art direction, palette, type pairing. Never a near-copy of a real business
  (check the name and the premise with a quick web search before building).
- One signature interaction that belongs to the subject (Halo Ridge: scroll flight; TIFAWT: split slideshow + arch track).
- A complete business flow: shop with bag, booking engine, reservation, configurator or enquiry. Checkout and payment
  always stop at a clear concept notice. No payment, no fake confirmations sent anywhere.
- 10 to 20 sections, product or room pages where the business has them, EN + AR with RTL, phone layout, reduced motion.
- Real photography from Higgsfield (Unlimited on the website). No invented testimonials, awards, press, staff or clients.
  AI people appear only as editorial models, never as named staff or guests.
- Tested: a per-site copy of xray-tests/tifawt.js (sections, flows, AR, phone, no errors), then verified on the
  Vercel preview in the browser.
- Branch showcase-flagship only. No production merge without Abdell saying so.

## Pipeline per site

1. Brief: name check, premise, art direction, signature, sections, business flow, products/rooms with prices (AED).
2. Prompts: showcase-assets/<slug>-prompts.json. Prefer 2x2 grids for editorial (4 images per generation); single
   shots for heroes, packshots and room heroes.
3. Generate on the Higgsfield website (tab with window.__hf helpers, paced queue, >= 40 s apart, at most 2 running,
   count 1/4, Unlimited on). Never click through Cloudflare; ask Abdell.
4. Crop grids in the Higgsfield sandbox (~/tf/proc.py grid), upload with media_upload, put URLs in the site's cells map.
5. Build with the shared kit + site-specific signature components. Add to lib/showcase/catalog.ts and the
   enquiry API SITES list.
6. Test, push, verify on the preview, report with screenshots.

## Image budget

- Seedream 5.0 Pro and GPT Image 2.6 are unlimited on the website until 30 Nov 2026 only. Until then, generate image
  banks for as many upcoming sites as possible. After that: Seedream 4.5, Seedream 5.0 Lite, Nano Banana, FLUX.2 Pro
  (Plus plan unlimited).
- Credits: 200 authorised, 105 used, 95 left (balance 928 on 26 Nov). Credits only for a few hero videos
  (seedance mini 720p 5 s = 5 credits). Check the quote before any spend.

## Order

Wave 1, one benchmark per series:

| # | Series | Concept | Signature | Business flow |
|---|--------|---------|-----------|---------------|
| 3 | Hotels | HAYRAT, a pearl-bank island hotel in the Gulf, 40 minutes by dhow | Scroll dive from the dhow to the oyster banks at 12 m | Booking engine: dates, guests, 5 room types, add-ons, summary |
| 4 | Restaurants | Chef's counter around one fire, DIFC-level fine dining | Tasting menu course by course; pick your seat at the counter | Reservation with seat map |
| 5 | Architecture | Studio with an exploded-axonometric project viewer | Building assembles floor by floor on scroll | Project enquiry with brief builder |
| 6 | Automotive | Grand tourer house | Configurator with turntable | Build summary + test-drive booking |
| 7 | Healthcare | Aesthetic / dental clinic | Treatment finder | Consultation booking calendar |
| 8 | Online shops | Oud and fragrance house | Scent layering builder | Shop with bag |
| 9 | Real estate | Branded residences tower | Pick a unit on the tower elevation | Availability + payment plan calculator |

Then fill the series to the counts in lib/showcase/catalog.ts (real estate 20, beauty 12, hotels 10, restaurants 8,
online shops 8, architecture 8, healthcare 7, automotive 7, professional 5, fitness 5, travel 5, events 5).

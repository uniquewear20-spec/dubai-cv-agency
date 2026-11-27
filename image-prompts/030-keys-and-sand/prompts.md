# 030 · KEYS & SAND

**Category:** Real estate  
**Concept:** Six design-led holiday apartments by the sea in Dubai, booked direct instead of through the big platforms: stay search, apartment pages and booking.  
**Website:** /showcase/keys-and-sand/  
**Images:** 10 generations, 22 images  
**Image status:** New art-directed prompts (27 Nov): generate these with Seedream 5.0 Pro

## Creative direction

The anti-listing. Instead of wide-angle rental photos, every apartment is shot like a design magazine story: morning light, an open book, linen moving in the breeze, the sea always in the frame. Six apartments, each with one signature colour against chalk white. The site should make a guest want to book direct for the feeling, not the price.

## Visual identity

- **Look:** bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic.
- **Palette:** chalk white, sea blue, sand, terracotta and natural rattan.
- **Type and layout cues for the website:** friendly rounded serif headlines, handwritten-feeling numerals for nights and guests; warm off-white backgrounds.

## Consistency

Every prompt that shows the building repeats this description word for word, so Seedream draws the same one each time. Do not edit it:

> a low, five-storey whitewashed apartment building right on a sandy beach in Dubai, with deep curved balconies, sea-blue painted shutters, built-in planters of bougainvillea and olive, and a quiet sea-facing courtyard with a small pool

- Generate 01 first; keep the building description word for word in exterior shots.
- Interiors share chalk-white walls, oak floors, linen and rattan; each apartment adds one colour (sea blue, terracotta or sand) as noted.
- Every prompt ends with the same look and palette sentence, so the set matches.
- People are always clearly different individuals, often seen from behind or with faces out of frame, because Seedream repeats one face when people are not described apart. Never a real person, a brand or a logo.
- Grids (2x2) give four pictures from one generation; Claude cuts them into four files.

## Settings (Higgsfield website)

Seedream 5.0 Pro · Quality 2K · Count 1/4 (keep it at 1/4 so Unlimited stays on) · Aspect ratio as listed · No reference images. Unlimited runs one picture at a time and queues one more: start the next when one finishes.

## Shot list

| # | File | Website section | Ratio | Type |
|---|---|---|---|---|
| 01 | `keys-and-sand__01-hero.png` | Home hero, full screen | 16:9 | single |
| 02 | `keys-and-sand__02-hero-mobile.png` | Home hero on phones | 9:16 | single |
| 03 | `keys-and-sand__03-building.png` | About the homes | 3:2 | single |
| 04 | `keys-and-sand__04-grid-blue.png` | Apartment page: Blue | 16:9 | 2x2 grid (4 images) |
| 05 | `keys-and-sand__05-grid-terracotta.png` | Apartment page: Terracotta | 16:9 | 2x2 grid (4 images) |
| 06 | `keys-and-sand__06-grid-sand.png` | Apartment page: Penthouse | 16:9 | 2x2 grid (4 images) |
| 07 | `keys-and-sand__07-courtyard.png` | Shared spaces | 4:3 | single |
| 08 | `keys-and-sand__08-arrival.png` | Your stay: arrival | 3:2 | single |
| 09 | `keys-and-sand__09-guests.png` | Guest moments | 3:2 | single |
| 10 | `keys-and-sand__10-grid-neighbourhood.png` | Around you | 1:1 | 2x2 grid (4 images) |

## Prompts

### 01 · Morning on the balcony

- **File:** `keys-and-sand__01-hero.png`
- **Section:** Home hero, full screen
- **Aspect ratio:** 16:9 (2K ≈ 2720×1536 px)
- **Camera:** Interior to balcony, 28mm

```text
Bright photograph from inside a holiday apartment out through open glass doors to a deep curved balcony of a low, five-storey whitewashed apartment building right on a sandy beach in Dubai, with deep curved balconies, sea-blue painted shutters, built-in planters of bougainvillea and olive, and a quiet sea-facing courtyard with a small pool: two rattan chairs, a small table with coffee and a bowl of figs, sheer linen curtains lifting in the breeze, the turquoise sea and a pale sandy beach beyond, warm morning sun, relaxed and inviting, nobody present. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 02 · The shutters

- **File:** `keys-and-sand__02-hero-mobile.png`
- **Section:** Home hero on phones
- **Aspect ratio:** 9:16 (2K ≈ 1536×2720 px)
- **Camera:** Vertical, 35mm

```text
Vertical photograph of a tall window with sea-blue painted shutters folded open on a white wall, a branch of bougainvillea across the corner, a slice of turquoise sea and sky through the window, a linen curtain moving, bright morning light, fresh and holiday-like. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 03 · The building

- **File:** `keys-and-sand__03-building.png`
- **Section:** About the homes
- **Aspect ratio:** 3:2 (2K ≈ 2496×1664 px)
- **Camera:** From the beach, 35mm

```text
Architectural photograph from the beach of a low, five-storey whitewashed apartment building right on a sandy beach in Dubai, with deep curved balconies, sea-blue painted shutters, built-in planters of bougainvillea and olive, and a quiet sea-facing courtyard with a small pool: soft morning light on the white curves, sea-blue shutters half open, bougainvillea spilling from the planters, a few sun loungers and a striped umbrella on the sand in front, calm sea, nobody posing. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 04 · The Blue Apartment

- **File:** `keys-and-sand__04-grid-blue.png` (cut into `keys-and-sand__04-grid-blue_1.png` to `_4.png`)
- **Section:** Apartment page: Blue
- **Aspect ratio:** 16:9 (2K ≈ 2720×1536 px)
- **Camera:** Interiors, 28mm

```text
A 2x2 grid of four separate photographs divided by thin white gutters, all four in one consistent style and light. A two-bedroom holiday apartment by the sea with chalk-white walls, oak floors, linen and rattan, accents of deep sea blue, bright natural light, nobody present. Top-left: the living room with a blue linen sofa and the sea through open doors. Top-right: a small kitchen with blue tiles and a bowl of lemons. Bottom-left: a bedroom with white linen and a blue throw facing the sea. Bottom-right: a shower room with blue zellige tiles and a round mirror. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 05 · The Terracotta Apartment

- **File:** `keys-and-sand__05-grid-terracotta.png` (cut into `keys-and-sand__05-grid-terracotta_1.png` to `_4.png`)
- **Section:** Apartment page: Terracotta
- **Aspect ratio:** 16:9 (2K ≈ 2720×1536 px)
- **Camera:** Interiors, 28mm

```text
A 2x2 grid of four separate photographs divided by thin white gutters, all four in one consistent style and light. A one-bedroom holiday apartment by the sea with chalk-white walls, oak floors, linen and rattan, accents of warm terracotta, bright natural light, nobody present. Top-left: a living area with a terracotta armchair and a reading lamp. Top-right: a dining nook with a round oak table and terracotta jugs of dried flowers. Bottom-left: a bedroom with a rattan headboard and terracotta linen. Bottom-right: a bathroom with a terracotta tiled floor and a wooden stool. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 06 · The Sand Penthouse

- **File:** `keys-and-sand__06-grid-sand.png` (cut into `keys-and-sand__06-grid-sand_1.png` to `_4.png`)
- **Section:** Apartment page: Penthouse
- **Aspect ratio:** 16:9 (2K ≈ 2720×1536 px)
- **Camera:** Interiors and roof, 24mm

```text
A 2x2 grid of four separate photographs divided by thin white gutters, all four in one consistent style and light. A three-bedroom holiday penthouse by the sea with chalk-white walls, oak, linen and rattan in warm sand tones, bright natural light, nobody present. Top-left: a double-height living room with a curved sand-coloured sofa and the sea beyond. Top-right: a roof terrace with a plunge pool and sun loungers. Bottom-left: a family bedroom with two beds and striped linen. Bottom-right: an outdoor dining table under a white pergola at sunset. Every person is a clearly different individual (age, build, skin tone, hair and clothing all differ) so no face repeats; faces turned away or out of frame. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 07 · The courtyard pool

- **File:** `keys-and-sand__07-courtyard.png`
- **Section:** Shared spaces
- **Aspect ratio:** 4:3 (2K ≈ 2336×1752 px)
- **Camera:** 35mm, afternoon

```text
Photograph of the quiet sea-facing courtyard of a low, five-storey whitewashed apartment building right on a sandy beach in Dubai, with deep curved balconies, sea-blue painted shutters, built-in planters of bougainvillea and olive, and a quiet sea-facing courtyard with a small pool: a small turquoise pool edged in white stone, olive trees in white planters, a few linen loungers, bougainvillea on the walls, afternoon light and soft shadows, peaceful, nobody present. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 08 · Welcome

- **File:** `keys-and-sand__08-arrival.png`
- **Section:** Your stay: arrival
- **Aspect ratio:** 3:2 (2K ≈ 2496×1664 px)
- **Camera:** 50mm, detail

```text
Close photograph of a welcome on an oak console in a holiday apartment: a brass key on a sea-blue tassel, a handwritten welcome card left blank, a bowl of local dates, a small jug of fresh flowers, a folded beach towel tied with string, warm afternoon light. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 09 · Holiday life

- **File:** `keys-and-sand__09-guests.png`
- **Section:** Guest moments
- **Aspect ratio:** 3:2 (2K ≈ 2496×1664 px)
- **Camera:** 35mm, candid

```text
Candid photograph of a couple and their young child on the beach in front of a low, five-storey whitewashed apartment building right on a sandy beach in Dubai, with deep curved balconies, sea-blue painted shutters, built-in planters of bougainvillea and olive, and a quiet sea-facing courtyard with a small pool at golden hour, building a sandcastle, all faces turned away or out of frame, soft warm light, the white building and blue shutters behind them, joyful and natural. Every person is a clearly different individual (age, build, skin tone, hair and clothing all differ) so no face repeats; faces turned away or out of frame. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

### 10 · The neighbourhood

- **File:** `keys-and-sand__10-grid-neighbourhood.png` (cut into `keys-and-sand__10-grid-neighbourhood_1.png` to `_4.png`)
- **Section:** Around you
- **Aspect ratio:** 1:1 (2K ≈ 2048×2048 px)
- **Camera:** Street and beach, 35mm

```text
A 2x2 grid of four separate photographs divided by thin white gutters, all four in one consistent style and light. A seaside neighbourhood in Dubai in bright light, people small or seen from behind, all different. Top-left: a quiet beach at early morning with footprints in the sand. Top-right: a seaside walkway with palm trees and cyclists. Bottom-left: a small cafe counter with pastries and coffee. Bottom-right: a fresh fruit stall with mangoes and pomegranates. Every person is a clearly different individual (age, build, skin tone, hair and clothing all differ) so no face repeats; faces turned away or out of frame. Overall look: bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic; colour palette of chalk white, sea blue, sand, terracotta and natural rattan. No text, no letters, no logos, no watermarks.
```

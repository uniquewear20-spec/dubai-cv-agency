"""Builds the image-prompt library for the concept websites: one folder per site with prompts.md
(visual direction, shot list and copy-paste prompts) and prompts.json, plus INDEX.md.
Run: python3 image-prompts/_build/build.py"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(ROOT)
SIZE = {"16:9": "2720×1536", "9:16": "1536×2720", "1:1": "2048×2048", "4:3": "2336×1752", "3:4": "1752×2336",
        "21:9": "3136×1344", "3:2": "2496×1664", "2:3": "1664×2496"}
NEG = "No text, no letters, no logos, no watermarks."
PEOPLE = ("Every person in the picture is a clearly different individual (age, build, skin tone, hair and clothing all vary) "
          "so no face is repeated; faces may be turned away or out of frame.")
GRID = "A 2x2 grid of four separate photographs separated by thin white gutters, all four in one consistent style and light. "
POS = ["Top-left", "Top-right", "Bottom-left", "Bottom-right"]


def cells(v):
    p = [x.strip() for x in v.split(";")]
    p = (p * 4)[:4]
    return " ".join(f"{a}: {b[0].upper() + b[1:]}." for a, b in zip(POS, p))


# (code, title, website section, aspect ratio, kind, camera, prompt template)
T = {
 "re": [
  ("hero", "Hero", "Home hero, full screen behind the headline", "16:9", "single", "Eye-level three-quarter view, 24mm tilt-shift, corrected verticals",
   "Architectural photograph of {home} in {place}. Golden-hour sun rakes across the facade, verticals perfectly straight, landscaped foreground, clear sky with open space above for a headline. It must feel built and lived-in, not rendered. No people."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Low angle looking up, 20mm",
   "Vertical architectural photograph looking up along {home} in {place}, facade lines converging into a clear sky, sunlight catching the main materials, strong graphic composition. No people."),
  ("aerial", "Aerial", "Location section", "16:9", "single", "Drone, 120 m, 45-degree angle",
   "Drone photograph of {home} in {place}, seen from about 120 metres at a 45-degree angle: the building, plot, access, landscaping and any nearby water clearly readable. Soft morning light, true colours, light haze on the horizon. No people visible."),
  ("twilight", "Blue hour", "Night band between sections", "16:9", "single", "Eye level, 35mm, tripod long exposure",
   "Blue-hour photograph of {home} in {place}: interiors glowing warm behind the glass, exterior lighting on, deep blue sky with a last band of light on the horizon, reflections on water or wet paving. No people."),
  ("grid-interiors", "Interiors", "Interiors gallery and unit pages", "16:9", "grid", "Interior, 24mm, eye level, one window light",
   GRID + "Interior photographs inside {home}, finished in {interior}, staged and uncluttered, one soft daylight, nobody present. Top-left: the main living room with its view. Top-right: the kitchen and dining area. Bottom-left: the principal bedroom. Bottom-right: the principal bathroom."),
  ("grid-amenities", "Amenities", "Amenities section", "1:1", "grid", "Architectural, 24mm",
   GRID + "The shared spaces of {home}, daylight, nobody present. Top-left: {amenity}. Top-right: the residents' gym with a view. Bottom-left: the arrival lobby with a concierge desk. Bottom-right: the landscaped garden or roof terrace."),
  ("view", "The view", "View section, full width", "21:9", "single", "Panoramic, 35mm, from the terrace",
   "Panoramic photograph from the main terrace of {home}: {view}. The edge of a lounge chair and a planter frame the foreground, late-afternoon haze, the view is the subject. No people."),
  ("grid-details", "Materials", "Materials and specification section", "1:1", "grid", "Macro, 100mm, raking side light",
   GRID + "Close-up photographs of the materials of {home}, raking side light, shallow depth of field. {grid:detail}"),
  ("lifestyle", "Lifestyle", "Living there section", "3:2", "single", "Editorial, 35mm, natural light",
   "Editorial lifestyle photograph at {home} in {place}: {lifestyle}. Candid, natural light, believable and calm. " + PEOPLE),
  ("grid-area", "Neighbourhood", "Neighbourhood section", "16:9", "grid", "Documentary, 35mm",
   GRID + "Documentary photographs of the neighbourhood around {place}, morning light. {grid:area} " + PEOPLE),
 ],
 "auto": [
  ("hero", "Hero, studio", "Home hero, full screen", "16:9", "single", "Low three-quarter front, 50mm, camera at headlight height",
   "Studio automotive photograph of {car}, finished in {paint}, three-quarter front view in a vast dark studio. One long overhead softbox draws a continuous highlight along the bonnet, shoulder line and roof; polished dark concrete floor with a soft reflection under the car; negative space on the left for a headline. Original vehicle design, unbadged."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Low head-on angle, 35mm",
   "Vertical automotive photograph of {car} in {paint}, head-on from a low angle so the face and lights fill the lower two thirds of the frame, dark studio, thin strips of light along the body, faint haze. Original vehicle design, unbadged."),
  ("profile", "Side profile", "Configurator base view", "21:9", "single", "Exact side elevation, 85mm, camera at axle height",
   "Clean side-profile studio photograph of {car} in {paint}, perfectly parallel to the camera on a seamless mid-grey background with a soft floor shadow, the whole silhouette readable, wheels straight, no perspective distortion. Original vehicle design, unbadged."),
  ("drive", "On the road", "Driving section", "21:9", "single", "Tracking shot from a camera car, 35mm, slow shutter",
   "Cinematic tracking photograph of {car} in {paint} driving on {road}, the car sharp, background streaked with motion blur, wheels spinning, low golden sun and long shadows. Original vehicle design, unbadged."),
  ("night", "At night", "Night or performance section", "16:9", "single", "Rolling shot, 24mm, long exposure",
   "Night photograph of {car} in {paint} moving through {city}, light trails and reflections running along the bodywork, wet tarmac mirroring the lights, the car sharp and the city soft. Original vehicle design, unbadged."),
  ("grid-paint", "Paint colours", "Configurator colour swatches", "1:1", "grid", "Identical three-quarter front pose and light in all four cells, 50mm",
   GRID + "The same car in the same three-quarter front pose and identical studio lighting in every cell, only the paint changes: {car}. Top-left: {paint}. Top-right: deep gloss black. Bottom-left: pale silver-white pearl. Bottom-right: a saturated signature colour that suits the design. Dark seamless studio. Original vehicle design, unbadged."),
  ("grid-exterior", "Exterior details", "Design details section", "1:1", "grid", "Macro, 100mm, shallow depth of field",
   GRID + "Close-ups of {car} in {paint}, one consistent studio light. Top-left: the headlight signature lit. Top-right: a forged wheel with the brake caliper behind the spokes. Bottom-left: the rear light bar glowing. Bottom-right: the sculpted shoulder line with one highlight along it. Unbadged."),
  ("grid-interior", "Interior", "Interior section", "16:9", "grid", "Interior, 28 and 50mm, soft window light",
   GRID + "Inside {car}, trimmed in {interior}. Top-left: the steering wheel and instrument display from the driver's seat. Top-right: the front seats seen from the rear door. Bottom-left: the centre console and controls in close-up. Bottom-right: stitching and materials on the door panel. Screens show abstract graphics only. Unbadged."),
  ("lifestyle", "Lifestyle", "Brand story or ownership section", "16:9", "single", "Editorial, 35mm, natural light",
   "Editorial lifestyle photograph: {lifestyle}, with {car} in {paint} in the scene. Natural and unposed. " + PEOPLE + " Unbadged."),
  ("garage", "Showroom", "Visit or test-drive section", "16:9", "single", "Architectural, 24mm, symmetrical",
   "Architectural interior photograph of {garage}, with {car} in {paint} displayed under linear ceiling light, symmetrical, calm and gallery-like, nobody present. Unbadged."),
 ],
 "hotel": [
  ("hero", "Hero", "Home hero, full screen", "16:9", "single", "Wide, 24mm, eye level",
   "Luxury travel photograph of {hotel} in {place} at golden hour, the whole property in its landscape, calm and timeless, open sky for a headline. No people."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Framed view through an opening, 28mm",
   "Vertical travel photograph at {hotel}: a framed view through a doorway or arch toward the landscape of {place}, morning light, one strong leading line. No people."),
  ("aerial", "Aerial", "The place section", "16:9", "single", "Drone, 50-degree angle",
   "Drone photograph of {hotel} in {place}, the layout of buildings, pools and paths readable, the landscape around it, soft morning light, true colours."),
  ("night", "Night", "Evening section and footer", "16:9", "single", "Tripod, 24mm, blue hour",
   "Blue-hour photograph of {hotel} in {place}: warm light in windows and lanterns along paths, deep blue sky, reflections, quiet and inviting. No people."),
  ("room-a", "Signature room", "Rooms section and room page", "4:3", "single", "Interior, 24mm, from the doorway",
   "Interior photograph of {room} at {hotel}, bed made with crisp linen, the view through the window or doors, soft morning light, no clutter, nobody present."),
  ("room-b", "Second room type", "Rooms section and room page", "4:3", "single", "Interior, 24mm",
   "Interior photograph of {room2} at {hotel}, styled for arrival, late-afternoon light, nobody present."),
  ("grid-rooms", "Room details", "Room pages gallery", "3:4", "grid", "Interior details, 35 and 50mm",
   GRID + "Details of {room} at {hotel}, nobody present. Top-left: the bathroom with stone and folded towels. Top-right: the private terrace at sunset. Bottom-left: the bedside with a lamp and a book. Bottom-right: the view from the bed through open doors."),
  ("grid-dining", "Dining", "Dining section", "3:4", "grid", "Food, overhead and 45 degrees, side light",
   GRID + "Food and dining at {hotel}, warm editorial food photography. {grid:dining} No faces."),
  ("grid-spa", "Spa", "Spa section", "3:4", "grid", "Calm interiors and details, 35mm",
   GRID + "The spa at {hotel}, calm, steam and soft light. {grid:spa} No faces."),
  ("grid-experiences", "Experiences", "Experiences or a-day-here section", "16:9", "grid", "Cinematic travel, 24-50mm",
   GRID + "Experiences around {hotel} in {place}, cinematic travel photography. {grid:experiences} " + PEOPLE),
  ("grid-details", "Details", "Materials band", "1:1", "grid", "Macro, raking light",
   GRID + "Close-up material details of {hotel}, raking light. {grid:detail}"),
  ("arrival", "Arrival", "Getting here section", "16:9", "single", "Cinematic, 35mm",
   "Travel photograph of arriving at {hotel}: {arrival}. Cinematic, warm, a sense of journey. " + PEOPLE),
 ],
 "food": [
  ("hero", "Hero, the room", "Home hero, full screen", "16:9", "single", "Interior, 24mm, evening practical light",
   "Restaurant interior photograph of {venue} in {place} during evening service, tables set, warm practical lighting, atmospheric and inviting, nobody in focus."),
  ("hero-mobile", "Signature dish", "Home hero on phones", "9:16", "single", "45 degrees, 85mm, shallow depth of field",
   "Vertical food photograph of {signature}, the signature of a {cuisine} kitchen, on a handmade plate, single side light, shallow depth of field, dark background."),
  ("hands", "In the kitchen", "Kitchen or chef section", "3:4", "single", "Close, 50mm, motion",
   "Editorial photograph of a cook's hands preparing {signature} at {venue}, steam and motion, warm light, face out of frame."),
  ("grid-dishes-a", "Dishes I", "Menu section", "1:1", "grid", "Overhead, same table surface, side light",
   GRID + "Overhead food photographs of {cuisine} dishes on handmade ceramics on the same table surface, one side light. {grid:dishes_a} No hands, no faces."),
  ("grid-dishes-b", "Dishes II", "Menu section", "1:1", "grid", "Overhead, same table surface, side light",
   GRID + "Overhead food photographs of {cuisine} dishes on handmade ceramics on the same table surface, one side light. {grid:dishes_b} No hands, no faces."),
  ("grid-drinks", "Drinks", "Drinks section", "1:1", "grid", "Backlit, 85mm",
   GRID + "Drinks at {venue}, moody bar photography with backlight and condensation. {grid:drinks} No labels, no faces."),
  ("grid-details", "Details", "Room and craft details", "3:4", "grid", "Macro, 50-100mm",
   GRID + "Close-up details of {venue}. {grid:detail}"),
  ("exterior", "Entrance", "Visit section", "3:4", "single", "Street level, 35mm, early evening",
   "Photograph of {exterior} for {venue} in {place}, early evening, warm light spilling out, inviting. No readable text, no people."),
  ("table", "The table", "Reservation section", "16:9", "single", "High three-quarter angle, 35mm",
   "Photograph of a table set for an evening at {venue}: several {cuisine} dishes to share, glasses and lamps, high three-quarter angle, hands of different diners reaching in, no faces."),
 ],
 "beauty": [
  ("hero", "Hero still life", "Home hero, full screen", "16:9", "single", "Still life, 85mm, directional light",
   "Luxury beauty still life of {product} with {ingredient}, on a sculpted stone plinth, soft directional light and long shadows, negative space on one side for a headline. Original packaging, no text on it."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Top light, 100mm",
   "Vertical beauty still life: {product} standing in shallow clear water with {ingredient} around it, light ripples, top light. Original packaging, no text."),
  ("grid-packshots", "Product packshots", "Shop grid and product pages", "1:1", "grid", "Packshot, same angle and light in every cell",
   GRID + "Packshots on a seamless backdrop in the brand palette, same lighting, angle and scale in every cell. {grid:line} Original packaging designs, no text."),
  ("ingredient", "Hero ingredient", "Ingredients section", "4:3", "single", "Macro, 100mm",
   "Macro photograph of {ingredient}, dew and texture, shallow depth of field, natural light."),
  ("origin", "Origin", "Origin story section, full width", "21:9", "single", "Landscape, 35mm, early morning",
   "Landscape photograph of {origin}, early morning light, cinematic and real. " + PEOPLE),
  ("grid-textures", "Textures", "Product page texture swatches", "1:1", "grid", "Macro, top light on glass",
   GRID + "Macro texture photographs, top light on glass. {grid:textures} No packaging, no text."),
  ("model", "Editorial portrait", "Brand story section", "3:4", "single", "Portrait, 85mm, window light",
   "Beauty editorial portrait of {model}, natural skin texture, soft window light, minimal makeup, calm expression. One person only."),
  ("grid-ritual", "Ritual", "How to use section", "3:4", "grid", "Hands, 50mm, soft light",
   GRID + "Hands-only ritual photographs, soft light. {grid:ritual} Faces out of frame."),
  ("space", "Boutique or atelier", "Visit section", "16:9", "single", "Interior, 24mm",
   "Interior photograph of {space}, warm and inviting, nobody present."),
  ("gift", "Gift set", "Gifts section", "4:3", "single", "Overhead, soft light",
   "Still life of {gift}, overhead, soft light, ribbon and paper. No text."),
 ],
 "shop": [
  ("hero", "Campaign hero", "Home hero, full screen", "16:9", "single", "Editorial, 50mm, cinematic light",
   "Campaign photograph: {campaign}, featuring {product}. Editorial, cinematic light, space for a headline. Original design, no logos."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Product, 85mm",
   "Vertical product photograph of {product} on a sculpted plinth against a soft gradient in the brand palette, dramatic light. Original design, no logos."),
  ("grid-products-a", "Products I", "Shop grid and product pages", "1:1", "grid", "Packshot, same angle and scale in every cell",
   GRID + "E-commerce packshots on a seamless backdrop, same lighting, angle and scale in every cell. {grid:line} Original designs, no logos, no text."),
  ("grid-products-b", "Products II", "Shop grid and product pages", "1:1", "grid", "Packshot, same angle and scale in every cell",
   GRID + "E-commerce packshots on a seamless backdrop, same lighting, angle and scale in every cell. {grid:line2} Original designs, no logos, no text."),
  ("grid-details", "Details", "Product page zoom details", "1:1", "grid", "Macro, 100mm",
   GRID + "Macro details. {grid:detail} No logos."),
  ("grid-atelier", "Atelier", "Craft section", "3:4", "grid", "Documentary craft, 35mm",
   GRID + "The workshop behind the brand, documentary craft photography. {grid:craft} " + PEOPLE),
  ("model", "Editorial", "Lookbook section", "3:4", "single", "Fashion, 85mm, natural light",
   "Fashion editorial: {model}, with {product}, natural light. One person only."),
  ("store", "Boutique", "Stores section", "16:9", "single", "Interior, 24mm",
   "Interior photograph of {store}, displays lit, nobody present, no signage text."),
  ("packaging", "Packaging", "Gifting and delivery section", "4:3", "single", "Still life, soft light",
   "Still life of {packaging}, an unboxing moment, soft light. No text."),
 ],
 "arch": [
  ("hero", "Hero project", "Home hero, full screen", "16:9", "single", "24mm tilt-shift, corrected verticals",
   "Architectural photograph of {hero} in {place}, strong light and shadow, corrected verticals, monumental yet calm, open sky. No people."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Vertical detail, 50mm",
   "Vertical architectural photograph of a tall slice of {hero}, its facade and shadows, graphic and minimal. No people."),
  ("interior", "Interior", "Project page", "4:3", "single", "Interior, 24mm",
   "Interior architectural photograph of {hero}: {interior}, daylight, nobody present."),
  ("grid-interiors", "Interiors", "Project page gallery", "3:4", "grid", "Interior, 24-35mm",
   GRID + "Interiors of {hero}, {interior}, one consistent daylight, nobody present. Top-left: the main living space. Top-right: a stair or circulation space. Bottom-left: the kitchen. Bottom-right: a private room."),
  ("grid-projects", "Other projects", "Projects index", "16:9", "grid", "Editorial architecture, 24mm",
   GRID + "Four other projects by the same studio, consistent editorial architecture photography. {grid:projects} No people."),
  ("grid-materials", "Materials", "Materials section", "1:1", "grid", "Macro, raking light",
   GRID + "Material close-ups, raking light. {grid:materials}"),
  ("grid-process", "Process", "How we work section", "1:1", "grid", "Documentary, 35mm",
   GRID + "The design process in the studio and on site. {grid:process} " + PEOPLE),
  ("grid-details", "Details", "Details band", "16:9", "grid", "Architectural detail, 50mm",
   GRID + "Architectural details, minimal compositions. {grid:details}"),
  ("studio", "The studio", "About and contact section", "16:9", "single", "Interior, 24mm",
   "Interior photograph of {studio}, models and drawings on tables, daylight, calm, no readable text. " + PEOPLE),
 ],
 "health": [
  ("hero", "Hero", "Home hero, full screen", "16:9", "single", "Interior, 24mm, natural light",
   "Interior photograph of {clinic} in {place}, calm, clean and welcoming, natural light, a sense of privacy and care, nobody present."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Interior detail, 35mm",
   "Vertical interior detail of {clinic}: a corridor or reception corner with soft light and plants, nobody present."),
  ("treatment", "Treatment room", "Treatments section", "4:3", "single", "Interior, 28mm",
   "Photograph of {treatment}, spotless and calm, soft daylight. Equipment of original design, no brand names."),
  ("consult", "Consultation", "Your first visit section", "3:2", "single", "Editorial, 35mm",
   "Editorial photograph: {consult}. Natural light, respectful and reassuring. " + PEOPLE),
  ("grid-spaces", "Spaces", "The clinic section", "16:9", "grid", "Interiors, 24mm",
   GRID + "Spaces of the clinic, consistent architectural photography, nobody present. {grid:spaces}"),
  ("grid-details", "Details", "Treatment pages", "1:1", "grid", "Close-ups, 50-100mm",
   GRID + "Clean, calm close-ups. {grid:detail} No labels, no text."),
  ("grid-care", "Care", "Care and aftercare section", "3:4", "grid", "Hands, 50mm, soft light",
   GRID + "Care moments, hands-led and respectful, soft light. {grid:care} No faces."),
  ("exterior", "Entrance", "Visit section", "3:4", "single", "Street level, 35mm",
   "Photograph of {exterior} in {place}, morning light, inviting, no readable signage."),
  ("calm", "Calm band", "Full-width calm band", "21:9", "single", "Minimal, 85mm",
   "Calm photograph: {calm}. Soft, minimal, plenty of negative space."),
 ],
 "fit": [
  ("hero", "Hero", "Home hero, full screen", "16:9", "single", "Sports, 35mm, dramatic light",
   "Sports photograph of {athlete} during {discipline}, the peak moment of effort, dramatic light, sweat and texture, space for a headline. One person."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Portrait, 50mm, side light",
   "Vertical sports portrait of {athlete} resting after {discipline}, breathing hard, strong side light. One person."),
  ("space", "The space", "The studio section", "16:9", "single", "Interior, 24mm",
   "Interior photograph of {space}, ready for a class, light streaming in, nobody present."),
  ("class", "Class", "Classes section", "16:9", "single", "Wide, 28mm",
   "Photograph of {group}, energetic, natural light. " + PEOPLE),
  ("grid-gear", "Gear", "Equipment or shop section", "1:1", "grid", "Close-ups, 50mm",
   GRID + "Equipment close-ups. {grid:gear} No logos."),
  ("grid-moves", "Moves", "Programme section", "3:4", "grid", "Same athlete, same light, 35mm",
   GRID + "The same person in all four cells, {athlete}, consistent light. {grid:moves}"),
  ("grid-recovery", "Recovery", "Recovery section", "3:4", "grid", "Calm, 50mm",
   GRID + "Recovery moments. {grid:recovery} " + PEOPLE),
  ("outdoor", "Outdoors", "Community or events section", "21:9", "single", "Wide, 24mm",
   "Cinematic wide photograph of {outdoor}. " + PEOPLE),
  ("detail", "Detail", "Membership section", "4:3", "single", "Macro, 100mm",
   "Macro photograph: {detail}."),
 ],
 "travel": [
  ("hero", "Hero", "Home hero, full width", "21:9", "single", "Wide, 24mm, golden light",
   "Cinematic travel photograph: {hero} in {place}, wide, golden light, epic scale, space for a headline."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Vertical, 28mm",
   "Vertical travel photograph: {hero}, framed for a phone screen with a strong foreground, golden light."),
  ("vehicle", "The ride", "Fleet or vessel section", "16:9", "single", "35mm, clean composition",
   "Photograph of {vehicle}, polished and real, clean composition."),
  ("interior", "Inside", "Comfort section", "4:3", "single", "Interior, 24mm",
   "Photograph of {interior}, inviting, warm light, nobody present."),
  ("grid-experiences", "Experiences", "Experiences section", "16:9", "grid", "Cinematic travel, 24-50mm",
   GRID + "Experiences, cinematic travel photography. {grid:experiences} " + PEOPLE),
  ("grid-details", "Details", "Details band", "1:1", "grid", "Close-ups, 50mm",
   GRID + "Travel details in close-up. {grid:details}"),
  ("people", "Travellers", "Why us section", "3:2", "single", "Editorial, 35mm",
   "Editorial travel photograph: {people}. Candid and warm. " + PEOPLE),
  ("landscape", "Landscape", "Destinations section", "16:9", "single", "Landscape, 35mm",
   "Landscape photograph of {landscape}, atmospheric."),
  ("night", "Night", "Evening band", "16:9", "single", "Long exposure, 24mm",
   "Night photograph: {night}, long exposure."),
 ],
 "pro": [
  ("hero", "Hero", "Home hero, full screen", "16:9", "single", "Architectural, 24mm",
   "Architectural photograph of {building} in {place}, confident and clean, morning light, space for a headline. No people, no readable signage."),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Looking up, 20mm",
   "Vertical photograph looking up at {building}, lines converging into the sky. No signage."),
  ("office", "Office", "About section", "16:9", "single", "Interior, 24mm",
   "Interior photograph of {office}, calm and premium, daylight, nobody present."),
  ("meeting", "Meeting", "How we work section", "3:2", "single", "Editorial, 35mm",
   "Editorial photograph: {meeting}. Natural light; documents and screens show no readable text. " + PEOPLE),
  ("grid-spaces", "Spaces", "The firm section", "16:9", "grid", "Interiors, 24mm",
   GRID + "Spaces of the firm, nobody present. {grid:spaces}"),
  ("grid-objects", "Objects", "Services cards", "1:1", "grid", "Still life, 50mm, soft light",
   GRID + "Still-life objects on a desk, soft light. {grid:objects} No readable text."),
  ("abstract", "Abstract band", "Full-width band", "21:9", "single", "Abstract, 85mm",
   "Abstract photograph: {abstract}. Minimal, elegant, wide negative space."),
  ("city", "City", "Contact section", "16:9", "single", "Cityscape, 35mm",
   "Photograph of {city}, atmospheric."),
 ],
 "events": [
  ("hero", "Hero", "Home hero, full screen", "16:9", "single", "Wide, 24mm",
   "Event photograph: {event}, atmospheric light, wide composition, space for a headline. " + PEOPLE),
  ("hero-mobile", "Hero for phones", "Home hero on phones", "9:16", "single", "Close, 50mm",
   "Vertical close and intimate event photograph: {event}. " + PEOPLE),
  ("venue", "Venue", "Venue section", "16:9", "single", "Interior or site, 24mm",
   "Photograph of {venue}, set and ready, nobody present."),
  ("grid-moments", "Moments", "Gallery section", "16:9", "grid", "Documentary, 35mm",
   GRID + "Documentary moments. {grid:moments} " + PEOPLE),
  ("grid-details", "Details", "Details band", "1:1", "grid", "Close-ups, 50mm",
   GRID + "Close-up details. {grid:details} No readable text."),
  ("people", "People", "About section", "3:2", "single", "Editorial, 35mm",
   "Editorial photograph: {people}. Candid. " + PEOPLE),
  ("setup", "Behind the scenes", "How it works section", "3:4", "single", "Documentary, 28mm",
   "Behind the scenes: {setup}. " + PEOPLE),
  ("night", "Night", "Closing band", "21:9", "single", "Night, 24mm",
   "Night photograph: {night}, cinematic."),
 ],
}

CAT = {"re": "Real estate", "auto": "Automotive", "hotel": "Hotels", "food": "Restaurants", "beauty": "Beauty",
       "shop": "Online shops", "arch": "Architecture and interiors", "health": "Healthcare", "fit": "Fitness",
       "travel": "Travel", "pro": "Finance, law and consulting", "events": "Events, education and creative"}

SITES = []


def S(slug, name, cat, wave, premise, look, palette, **v):
    SITES.append(dict(slug=slug, name=name, cat=cat, wave=wave, premise=premise, look=look, palette=palette, v=v))


exec(open(os.path.join(os.path.dirname(__file__), "sites.py"), encoding="utf-8").read())


def render(t, s):
    v = dict(s["v"])
    t = re.sub(r"\{grid:(\w+)\}", lambda m: cells(v[m.group(1)]), t)
    return t.format(**v) + f" Overall look: {s['look']}; colour palette of {s['palette']}. " + NEG


def shots_for(s):
    out = []
    for i, (code, title, section, ar, kind, cam, tpl) in enumerate(T[s["cat"]], 1):
        out.append(dict(n=i, file=f"{s['slug']}__{i:02d}-{code}.png", title=title, section=section, ar=ar, kind=kind,
                        camera=cam, prompt=render(tpl, s)))
    return out


# the three sites whose prompts were written earlier, kept as they were
PRE = {
 "hayrat": ("HAYRAT", "hotel", 0, "Eighteen rooms on an old pearl-diving island in the Gulf; a scroll dive to the oyster banks and a booking engine.", "showcase-assets/hayrat-prompts.json", "Generated (by Claude, 26 Nov)",
            {"hy_hero_dhow": "Home hero, above the water", "hy_hero_jetty": "Hero on phones and arrival", "hy_aerial": "The island section", "hy_night": "A day here, 21:30, and footer",
             "hy_room_barasti": "Room: Barasti House", "hy_room_merchant": "Room: Merchant's Room", "hy_room_nakhuda": "Room: Nakhuda's Roof", "hy_room_lagoon": "Room: Lagoon Pavilion", "hy_room_dana": "Room: Dana Residence",
             "hy_dive_surface": "The dive, 0-4 m", "hy_dive_diver": "The dive, 8 m", "hy_dive_bank": "The dive, 12 m", "hy_pearl": "The dive, the pearl",
             "hy_grid_dining": "Dining", "hy_grid_experience": "A day here", "hy_grid_spa": "The Salt House spa", "hy_grid_details": "Materials band", "hy_grid_rooms": "Room pages gallery"}),
 "mawqid": ("MAWQID", "food", 1, "Fourteen seats around one open fire in Al Quoz, Dubai; a tasting menu you scroll at each course's heat and a reservation where you pick your seat.", "showcase-assets/mawqid-prompts.json", "Not generated yet (site built, waiting for images)",
            {"mq_hero_counter": "Home hero", "mq_hero_hands": "A night at the counter", "mq_fire_macro": "Three woods: oak", "mq_smoke": "Three woods: date palm", "mq_grid_dishes_a": "The fire menu, courses 1-4",
             "mq_grid_dishes_b": "The fire menu, courses 5-8", "mq_grid_dishes_c": "Courses 9-10 and to finish", "mq_grid_pairing": "Ferments and teas", "mq_grid_room": "Three woods: olive, and details",
             "mq_grid_views": "Seat views (counter map and reservation)", "mq_private": "The whole counter (private hire)", "mq_entrance": "Find the door (visit)", "mq_ash": "Questions (background)", "mq_wood": "Spare: wood store"}),
 "zill": ("ZILL", "arch", 1, "An architecture studio for hot climates; a courtyard house that assembles floor by floor on scroll, a sun study and a brief builder.", "showcase-assets/zill-prompts.json", "Not generated yet",
          {"zl_hero_house": "Home hero", "zl_courtyard": "Hero on phones and the courtyard", "zl_shadow": "Sun study band", "zl_wind_guesthouse": "Project: mountain guesthouse", "zl_earth_villa": "Project: rammed-earth villa",
           "zl_cafe": "Project: arcade cafe", "zl_pavilion": "Project: desert pavilion", "zl_model": "The exploded model section", "zl_grid_materials": "Materials", "zl_grid_process": "How we work",
           "zl_grid_interiors": "Courtyard House interiors", "zl_grid_details": "Details band"}),
}

LOOKS = {"hayrat": ("Gulf dawn and lagoon light, nacre and teak, calm documentary travel photography", "nacre white, lagoon teal, deep sea blue, teak"),
         "mawqid": ("firelit, warm and smoky night photography, smoked oak and ember", "smoked oak, soot, ash grey, ember orange, copper"),
         "zill": ("monumental minimal architecture photography, hard sun and deep shade", "lime white, sand, ochre earth, olive, shadow blue")}


def write_site(num, s, shots, status):
    folder = os.path.join(ROOT, f"{num:03d}-{s['slug']}")
    os.makedirs(folder, exist_ok=True)
    gens = len(shots)
    imgs = sum(4 if x["kind"] == "grid" else 1 for x in shots)
    L = [f"# {num:03d} · {s['name']}", "", f"**Category:** {CAT[s['cat']]}  ", f"**Concept:** {s['premise']}  ",
         f"**Website:** /showcase/{s['slug']}/  ", f"**Images:** {gens} generations, {imgs} images  ", f"**Image status:** {status}", "",
         "## Visual direction", "", f"- **Look:** {s['look']}.", f"- **Palette:** {s['palette']}.",
         "- **Consistency:** every prompt below ends with the same look and palette sentence, so the set matches. Generate the hero first; if it lands, keep the others as written. Grids (2x2) give four images from one generation; Claude cuts them into four files.",
         "- **People:** any shot with people asks for clearly different individuals, because Seedream repeats one face when people are not described apart. Never add a real person or a brand.",
         "", "## Settings (Higgsfield website)", "",
         "Seedream 5.0 Pro · Quality 2K · Count 1/4 (keep it at 1/4 so Unlimited stays on) · Aspect ratio as listed · No reference images.", "",
         "## Shot list", "", "| # | File | Website section | Ratio | Type |", "|---|---|---|---|---|"]
    for x in shots:
        L.append(f"| {x['n']:02d} | `{x['file']}` | {x['section']} | {x['ar']} | {'2x2 grid (4 images)' if x['kind'] == 'grid' else 'single'} |")
    L += ["", "## Prompts", ""]
    for x in shots:
        L += [f"### {x['n']:02d} · {x['title']}", "",
              f"- **File:** `{x['file']}`" + (f" (cut into `{x['file'][:-4]}_1.png` to `_4.png`)" if x["kind"] == "grid" else ""),
              f"- **Section:** {x['section']}", f"- **Aspect ratio:** {x['ar']} (2K ≈ {SIZE.get(x['ar'], '')} px)",
              f"- **Camera:** {x['camera']}", "", "```text", x["prompt"], "```", ""]
    open(os.path.join(folder, "prompts.md"), "w", encoding="utf-8").write("\n".join(L))
    json.dump(dict(site=s["name"], slug=s["slug"], category=CAT[s["cat"]], concept=s["premise"], look=s["look"], palette=s["palette"],
                   settings="Seedream 5.0 Pro, 2K, count 1/4, Unlimited on", shots=shots),
              open(os.path.join(folder, "prompts.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return dict(num=num, name=s["name"], cat=CAT[s["cat"]], wave=s["wave"], folder=f"{num:03d}-{s['slug']}", gens=gens, imgs=imgs, status=status)


DONE = {"mawqid", "zill", "oriel-88", "khayyal", "muskana", "the-enamel-room", "shoreline-9", "thahab"}  # generated by Abdell, 26 Nov
DONE_NOTE = "Generated (Abdell, 26 Nov)"


def main():
    rows = []
    num = 3
    for slug, (name, cat, wave, premise, path, status, sections) in PRE.items():
        jobs = json.load(open(os.path.join(REPO, path), encoding="utf-8"))
        if isinstance(jobs, dict):
            jobs = next((x for x in jobs.values() if isinstance(x, list)), None) or [dict(id=k, **(x if isinstance(x, dict) else {"prompt": x})) for k, x in jobs.items()]
        jobs = [dict(id=j.get("id") or j.get("name"), ar=j.get("ar") or j.get("aspect_ratio") or "16:9", prompt=j.get("prompt", "")) for j in jobs]
        look, pal = LOOKS[slug]
        s = dict(slug=slug, name=name, cat=cat, wave=wave, premise=premise, look=look, palette=pal)
        shots = []
        for i, j in enumerate(jobs, 1):
            shots.append(dict(n=i, file=f"{slug}__{i:02d}-{j['id'].split('_', 1)[1].replace('_', '-')}.png", title=j["id"].split("_", 1)[1].replace("_", " ").capitalize(),
                              section=sections.get(j["id"], ""), ar=j["ar"], kind="grid" if "_grid_" in j["id"] else "single", camera="As described in the prompt", prompt=j["prompt"]))
        rows.append(write_site(num, s, shots, DONE_NOTE if slug in DONE else status))
        num += 1
    order = sorted(SITES, key=lambda s: (s["wave"], list(CAT).index(s["cat"])))
    for s in order:
        try:
            ov = os.path.join(REPO, "showcase-assets", f"{s['slug']}-prompts.json")
            o = json.load(open(ov, encoding="utf-8")) if os.path.exists(ov) else None
            if isinstance(o, dict):
                s = dict(s, premise=o["premise"], look=o["look"], palette=o["palette"])
                shots = [dict(n=i, file=f"{s['slug']}__{i:02d}-{x['id']}.png", title=x["title"], section=x["section"], ar=x["ar"],
                              kind="grid" if x.get("grid") else "single", camera=x["camera"],
                              prompt=x["prompt"].replace("{vehicle}", o["vehicle"]) + f" Overall look: {o['look']}; colour palette of {o['palette']}. " + NEG)
                         for i, x in enumerate(o["shots"], 1)]
                rows.append(write_site(num, s, shots, "New concept (26 Nov): generate these; the old green hypercar set is not used"))
            else:
                rows.append(write_site(num, s, shots_for(s), DONE_NOTE if s["slug"] in DONE else "Not generated yet"))
            num += 1
        except Exception as e:
            print("SKIPPED", s["slug"], repr(e))
    G = sum(r["gens"] for r in rows if not r["status"].startswith("Generated"))
    I = sum(r["imgs"] for r in rows if not r["status"].startswith("Generated"))
    L = ["# Image prompt library: the 98 remaining concept websites", "",
         f"Built 26 Nov 2026. {len(rows)} websites, {G} generations still to run ({I} images). Sites 001 Halo Ridge and 002 TIFAWT are finished and not listed.", "",
         "## How to generate", "",
         "1. Higgsfield website → Image → **Seedream 5.0 Pro**, Quality **2K**, Count **1/4** (keep 1/4: other counts switch Unlimited off and cost credits), Unlimited **on**.",
         "2. Set the aspect ratio shown for the shot, paste the prompt exactly as written (the copy button on each grey block), generate. Two can run at once.",
         "3. Work down this list in order: it follows the build order, so the next site to be built always has its pictures first.",
         "4. Nothing to download or rename: Claude finds each picture in your Higgsfield library by its prompt. If a picture is wrong (a repeated face, text, a logo, a deformed car), generate it again with the same prompt, or delete the bad one.",
         "5. Grids (2x2) are four pictures in one generation; Claude cuts them.", "",
         "Names are working names: each one gets a final web check before its site is built. Prompts never show a name, so a rename changes nothing here.", "",
         "## Websites", "", "| # | Wave | Website | Category | Generations | Images | Prompts | Pictures | Folder |", "|---|---|---|---|---|---|---|---|---|"]
    for r in rows:
        L.append(f"| {r['num']:03d} | {r['wave'] or 'built'} | {r['name']} | {r['cat']} | {r['gens']} | {r['imgs']} | Ready | {r['status']} | [{r['folder']}](./{r['folder']}/prompts.md) |")
    open(os.path.join(ROOT, "INDEX.md"), "w", encoding="utf-8").write("\n".join(L) + "\n")
    print(len(rows), "sites,", G, "generations,", I, "images")


main()

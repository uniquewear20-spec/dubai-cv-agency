# Batch 1 of the art-directed Seedream 5.0 Pro prompts (27 Nov 2026). Each site is written by hand:
# a creative direction, one fixed description of its building or venue ({anchor}) repeated word for
# word in every prompt that shows it, and production prompts per shot. Run: python3 pro_batch1.py
# then python3 build.py. Files land in showcase-assets/<slug>-prompts.json.
import json, os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "showcase-assets")
STATUS = "New art-directed prompts (27 Nov): generate these with Seedream 5.0 Pro"
GRID = "A 2x2 grid of four separate photographs divided by thin white gutters, all four in one consistent style and light. "
PEOPLE = "Every person is a clearly different individual (age, build, skin tone, hair and clothing all differ) so no face repeats; faces turned away or out of frame."

SITES = {}

# ─────────────────────────────────────────────── 013 KAI 8
SITES["kai-8"] = dict(
    name="KAI 8",
    premise="An eight-seat omakase counter in a quiet DIFC lane: the sequence menu course by course, seat booking.",
    look="quiet, low-key Japanese counter photography, warm tungsten pin lights in deep shadow, 50mm at seated eye level, shallow depth of field, photorealistic",
    palette="pale hinoki wood, black lacquer, rice white, tuna red and muted bronze",
    direction="KAI 8 is told from seat four. One long slab of pale hinoki, eight seats and a single chef; everything else falls away into warm darkness. Photography is intimate and still: pools of tungsten light on wood, steam, the gloss of rice and fish, hands at work, never a face. Close crops and slow reveals carry the site, so every picture leaves dark negative space for type.",
    type="tall condensed serif headlines against black, small calm sans for menus; generous dark space around each dish.",
    anchor_name="counter",
    anchor="an intimate eight-seat omakase counter made from one thick slab of pale hinoki wood with a softly rounded, polished front edge, eight low black lacquer stools, a back wall of dark charred cedar boards, one narrow shelf of hand-thrown ceramic tea pots, a warm tungsten pin light recessed above each seat, a white linen curtain hanging at the entrance",
    consistency=["Generate 01 first: it fixes the counter and the light. Keep the counter description as written in every prompt.",
                 "Dishes are always on matte black or dark grey hand-thrown ceramics on the hinoki, lit by one warm light from the left."],
    shots=[
        dict(id="hero", title="The counter", section="Home hero, full screen", ar="16:9", camera="Seated eye level at the end of the counter, 35mm",
             prompt="Cinematic interior photograph of {anchor}, seen from the end of the counter at seated eye level, the hinoki slab running away into the frame in perfect perspective, eight place settings each with a black lacquer plate, a small hinoki chopstick rest and a ceramic cup, a long slicing knife resting on a folded white cloth at the centre, pools of warm light on the wood and deep shadow everywhere else, a thin ribbon of steam rising from a wooden rice tub, quiet and expectant, nobody present."),
        dict(id="hero-mobile", title="One seat", section="Home hero on phones", ar="9:16", camera="High angle over one seat, 35mm",
             prompt="Vertical photograph looking down at a single place setting on {anchor}: the fine straight grain of the pale hinoki filling the frame, a matte black ceramic plate, chopsticks on a small hinoki rest, a rough ceramic cup of steaming green tea, one pin light making a soft warm circle on the wood, the edges falling into rich shadow, calm and minimal, nobody present."),
        dict(id="otoro", title="Otoro", section="The sequence: signature course", ar="4:3", camera="100mm macro, very shallow depth of field",
             prompt="Macro food photograph of one piece of otoro nigiri on a matte black ceramic plate on the hinoki counter: pale pink fatty tuna with fine white marbling draped over a small oblong of glossy rice, a thin brushed glaze of soy catching the light, a tiny dot of fresh green wasabi, warm tungsten key light from the left, the background falling to black, glistening and fresh, appetising and precise."),
        dict(id="hands", title="The chef's hands", section="Craft section", ar="3:2", camera="Close, 85mm, counter height",
             prompt="Close photograph across {anchor} of a sushi chef's hands shaping nigiri: the right hand pressing a slice of deep red tuna onto rice, the left hand cupped beneath, crisp white jacket cuffs, the chef's face out of frame above, a wet wooden rice tub and a long single-edged slicing knife on a white cloth beside, a slight motion blur in the fingers, warm light and deep shadow."),
        dict(id="grid-sequence-a", title="The sequence, first half", section="The sequence: courses 1 to 4", ar="1:1", grid=True, camera="45-degree overhead, 85mm",
             prompt=GRID + "Each picture is one course on dark hand-thrown ceramics on pale hinoki wood, warm light from the left, dark surroundings. Top-left: three slices of sashimi, tuna, yellowtail and sea bream, on crushed ice in a dark ceramic bowl. Top-right: a spoon of bright orange sea urchin on warm rice. Bottom-left: a hand roll in crisp toasted seaweed standing in a small bamboo holder. Bottom-right: a piece of lightly torch-seared fish with a glossy surface and a few flakes of sea salt."),
        dict(id="grid-sequence-b", title="The sequence, second half", section="The sequence: courses 5 to 8", ar="1:1", grid=True, camera="45-degree overhead, 85mm",
             prompt=GRID + "Each picture is one course on dark ceramics or black lacquer on pale hinoki wood, warm light from the left, dark surroundings. Top-left: a clear golden broth in a black lacquer bowl with one shiitake mushroom and a curl of yuzu peel. Top-right: a thick slice of layered sweet egg omelette with a caramelised top. Bottom-left: a fillet of glazed grilled black cod on a green leaf. Bottom-right: a scoop of pale yuzu sorbet in a frosted glass cup."),
        dict(id="grid-tea", title="Teas and ferments", section="Pairings section", ar="3:4", grid=True, camera="Side light, 50mm",
             prompt=GRID + "Non-alcoholic pairings at a hinoki counter in warm low light. Top-left: green tea poured from a black cast-iron kettle into a rough ceramic cup, steam rising. Top-right: a tall glass of sparkling yuzu soda with a twist of peel. Bottom-left: cold roasted barley tea in a small glass with condensation. Bottom-right: bright green whisked matcha in a wide hand-thrown bowl beside a bamboo whisk."),
        dict(id="grid-craft", title="Tools of the counter", section="Details band", ar="1:1", grid=True, camera="Macro still life, 100mm",
             prompt=GRID + "Still lifes of a sushi chef's tools on pale hinoki wood in warm light and deep shadow. Top-left: a long single-edged knife resting on a folded white cloth. Top-right: a fresh wasabi root being grated on a small paddle into a green paste. Bottom-left: a wooden rice tub with a damp paddle and steam. Bottom-right: black lacquer chopsticks on a small hinoki rest."),
        dict(id="door", title="The door", section="Visit section", ar="3:4", camera="Night street, 35mm",
             prompt="Night photograph of a narrow doorway in a quiet side lane between modern concrete buildings: a dark timber door half covered by a plain white linen curtain, one round paper lantern glowing beside it, wet stone paving reflecting the warm light, a thin trail of steam from a vent, no signage, no people, discreet and inviting."),
        dict(id="after-service", title="After service", section="Full-width closing band", ar="21:9", camera="Wide, 24mm, long exposure",
             prompt="Panoramic interior photograph of {anchor} after the last guest has left: the hinoki slab wiped clean and glowing under dimmed pin lights, the stools tucked in, a cast-iron kettle steaming at the end of the counter, the rest of the room in velvet darkness, still and cinematic, nobody present."),
    ],
)

# ─────────────────────────────────────────────── 022 SAHRA STABLES ESTATE
SITES["sahra-stables"] = dict(
    name="SAHRA STABLES ESTATE",
    premise="A private equestrian estate where the paddocks meet the dunes, on the desert edge outside Dubai: an estate tour, the stables and arena, and an enquiry.",
    look="warm country-estate photography at the desert's edge, low golden sun, fine dust glowing in the air, 35mm and 85mm, unhurried and photorealistic",
    palette="sand, chestnut, olive green, bone white and saddle brown",
    direction="An estate told like a country-house monograph moved to the desert. Long, low, earth-coloured architecture sits on the line where white paddock rails meet red dunes; Arabian horses give it life and scale. Light is always low and golden or blue at dawn, with dust in the air. The site moves from the arrival avenue to the house, the stables, the arena and out onto the dunes.",
    type="wide-tracked serif capitals for the estate name, a warm sans for text; long horizontal compositions to match the architecture.",
    anchor_name="estate",
    anchor="a long, low single-storey estate house of rammed earth and sand-coloured lime render with a deep veranda roofed in dark timber on slender bronze columns, a flat roof with a thin bronze edge, tall oak louvred shutters, an inner courtyard of ghaf and olive trees, a matching rammed-earth stable block with tall arched openings and dark oak stable doors, white post-and-rail paddock fences, on the edge of red dunes outside Dubai",
    consistency=["Generate 01 first; keep the estate description exactly as written in every prompt that shows the buildings.",
                 "The horses are always purebred Arabians: one dapple grey, one chestnut, one bay. Keep those colours when they reappear."],
    shots=[
        dict(id="hero", title="The estate at golden hour", section="Home hero, full screen", ar="16:9", camera="From the paddock, 35mm, eye level",
             prompt="Architectural landscape photograph of {anchor}, seen across a paddock at golden hour: a dapple grey and a chestnut Arabian horse grazing in the foreground, white fence rails leading the eye to the long veranda glowing in low sun, warm dust hanging in the air, red dunes rising behind under a pale clear sky, wide, calm and majestic."),
        dict(id="hero-mobile", title="The grey", section="Home hero on phones", ar="9:16", camera="85mm, shallow depth of field",
             prompt="Vertical portrait photograph of a dapple grey Arabian horse with a fine dished face and a long silver mane standing in profile before the deep veranda of {anchor}, low sun rimming the mane with gold, the architecture softly out of focus, dust glowing in the air, noble and quiet."),
        dict(id="arrival", title="The arrival avenue", section="Arrival section", ar="3:2", camera="Centred, 50mm",
             prompt="Photograph down a long straight gravel avenue lined with old ghaf trees leading to {anchor}, a pair of slim bronze gates open in the foreground, long late-afternoon shadows striping the gravel, the low house glowing at the end of the avenue, symmetrical and serene, nobody present."),
        dict(id="great-room", title="The great room", section="The house", ar="16:9", camera="Interior, 24mm, natural light",
             prompt="Interior photograph of the great room of {anchor}: thick rammed-earth walls, a ceiling of dark oak beams, a long refectory table of oak, deep cognac leather sofas around a stone fireplace, wool rugs in sand and rust, tall shutters folded open to the paddocks, low golden sunlight slanting across the floor, lived-in, warm and quiet, nobody present."),
        dict(id="stables", title="The stable aisle", section="The stables", ar="4:3", camera="Aisle perspective, 35mm",
             prompt="Photograph down the central aisle of the stable block of {anchor}: oak stable doors on both sides with polished bronze fittings, a bay Arabian horse looking out over one half-door, shafts of sunlight falling through high arched openings onto swept sand-coloured stone, dust floating in the beams, saddles on oak racks, peaceful."),
        dict(id="grid-house", title="The house", section="Rooms gallery", ar="16:9", grid=True, camera="Interiors, 28mm, natural light",
             prompt=GRID + "Interiors of a rammed-earth desert estate house with oak, bronze, linen and leather, in low warm daylight, nobody present. Top-left: the principal bedroom, a low oak bed with linen and a view through open shutters to the paddocks. Top-right: a kitchen of oak cabinetry, a long sand-coloured stone island and copper pans. Bottom-left: a tack room of saddles and bridles hung on oak pegs. Bottom-right: a bathroom with a carved stone bathtub before a window onto the dunes."),
        dict(id="arena", title="The riding arena", section="Arena section", ar="21:9", camera="Wide, 24mm",
             prompt="Panoramic photograph inside a covered riding arena built of rammed earth with a long-span roof of exposed dark timber trusses: a rider in a white shirt schooling a chestnut Arabian horse at a collected canter across raked sand, sunlight falling through a long clerestory in bright shafts, dust lit gold, the rider's face turned away, grand and calm."),
        dict(id="grid-details", title="Materials", section="Materials band", ar="1:1", grid=True, camera="Macro, raking light",
             prompt=GRID + "Material close-ups in raking golden light. Top-left: the layered bands of a rammed-earth wall in sand and ochre. Top-right: the hand stitching on a cognac saddle. Bottom-left: a heavy cast bronze door pull on dark oak. Bottom-right: oak grain with a black iron hinge on a stable door."),
        dict(id="grooming", title="Dawn in the courtyard", section="Life on the estate", ar="3:2", camera="50mm, dawn",
             prompt="Photograph in the courtyard of {anchor} at dawn: a groom in a sand-coloured shirt brushing the dapple grey Arabian horse beside a ghaf tree, face turned away, soft blue dawn light with the first warm rays on the walls, a bucket and brushes on the stone, intimate and calm."),
        dict(id="dune-ride", title="The ride out", section="Beyond the estate", ar="21:9", camera="Telephoto, 200mm",
             prompt="Cinematic panoramic photograph of two riders on Arabian horses, a grey and a bay, cantering along the crest of a red dune at sunset, small in the frame, long shadows on the rippled sand, a plume of glowing dust behind them, the low lights of {anchor} visible far away at the dune's edge."),
        dict(id="aerial", title="The estate from above", section="Estate plan section", ar="16:9", camera="Drone, 120 m, 45 degrees",
             prompt="Drone photograph from about 120 metres at a 45-degree angle of {anchor}: the long house with its courtyard of trees, the stable block, the covered arena, a geometric pattern of white-fenced paddocks with horses, a gravel avenue of ghaf trees, and the red dunes rolling away on one side, warm late light with long shadows."),
    ],
)

# ─────────────────────────────────────────────── 023 CLOUDLINE
SITES["cloudline"] = dict(
    name="CLOUDLINE",
    premise="Five mountain villas on a ridge of Jebel Jais, above the clouds; a plot picker and a private viewing.",
    look="cool alpine-architecture photography above a sea of clouds, blue dawn and amber firelight, 24mm, mist and silence, photorealistic",
    palette="basalt grey, cloud white, juniper green, smoked oak and ember amber",
    direction="Living above the weather. Each villa is a pair of dark stone volumes, one cantilevered over the void, and the clouds are the second subject: they fill the valleys at dawn and part to reveal the mountains. The mood shifts from cold blue dawn to warm firelit night, always with silence and space. Wide frames, low horizons, lots of sky and cloud for type to sit on.",
    type="thin, widely spaced capitals floating in the sky areas; calm small text; layouts that leave the clouds clear.",
    anchor_name="villa",
    anchor="a contemporary mountain villa of dark split-face basalt walls and floor-to-ceiling glass, two long flat-roofed volumes stacked at an angle, the upper volume cantilevered six metres over a cliff edge, warm oak soffits, slim black steel window frames, a long rectangular infinity pool on a stone terrace at the cliff edge, on a ridge of the Hajar mountains of Ras Al Khaimah",
    consistency=["Generate 01 first; it fixes the villa. Keep the villa description word for word.",
                 "Dawn shots share the same cold blue light with a pink edge; night shots the same amber interiors under stars."],
    shots=[
        dict(id="hero", title="Above the clouds", section="Home hero, full screen", ar="16:9", camera="24mm from the ridge, dawn",
             prompt="Architectural photograph of {anchor} at dawn, standing above a continuous sea of white clouds that fills the valleys below, the first pink light touching the stone and the glass, the pool reflecting the sky, jagged peaks rising through the clouds in the distance, crisp, silent and breathtaking, nobody present."),
        dict(id="hero-mobile", title="The cantilever", section="Home hero on phones", ar="9:16", camera="Looking up, 20mm",
             prompt="Vertical photograph looking up from the rocks beneath the cantilevered upper volume of {anchor}: the oak soffit and black steel frame overhead, wisps of cloud drifting underneath the overhang, a deep blue dawn sky above, dramatic and weightless."),
        dict(id="living", title="The living room", section="The villa", ar="16:9", camera="Interior, 24mm",
             prompt="Interior photograph of the living room of {anchor}: a long low sofa in oatmeal wool facing a floor-to-ceiling window onto a sea of clouds, a suspended black steel fireplace with a low fire, basalt and oak surfaces, sheepskin and wool throws, a small table with two cups of coffee, soft dawn light mixing with the warm glow of the fire, nobody present."),
        dict(id="pool", title="The edge", section="Pool and terrace", ar="21:9", camera="Water level, 24mm",
             prompt="Panoramic photograph at water level along the infinity pool of {anchor}: the still water merging with the sea of clouds below, faint steam rising from the heated pool in the cold dawn air, one teak lounger with a folded towel, the mountains glowing pink on the horizon, nobody present."),
        dict(id="grid-rooms", title="Rooms", section="Rooms gallery", ar="16:9", grid=True, camera="Interiors, 28mm",
             prompt=GRID + "Interiors of a dark basalt and glass mountain villa with oak, wool and linen, soft dawn light, clouds outside every window, nobody present. Top-left: the principal bedroom with a low bed facing a glass wall onto the clouds. Top-right: a kitchen of smoked oak and honed basalt with a long island. Bottom-left: a bathroom with a freestanding stone bathtub at the window. Bottom-right: a reading nook in a deep window seat with books and a wool blanket."),
        dict(id="night", title="Night on the ridge", section="Evening band", ar="16:9", camera="Long exposure, 24mm",
             prompt="Night photograph of {anchor} glowing amber from within under a sky full of stars, a fire pit burning on the stone terrace, low cloud lit silver by the moon filling the valley below, the cantilever floating over darkness, peaceful and warm, nobody present."),
        dict(id="terrace-life", title="Coffee above the weather", section="Life here", ar="3:2", camera="50mm, from behind",
             prompt="Photograph from behind of a couple wrapped in thick wool blankets sitting on the stone terrace of {anchor} with cups of coffee, looking out over a sea of clouds at sunrise, both faces turned away, steam rising from the cups, intimate and still."),
        dict(id="ridge", title="The ridge", section="Plot picker", ar="16:9", camera="Drone, 300 m",
             prompt="Aerial drone photograph of a long mountain ridge with five contemporary dark basalt villas spaced far apart along it, each with a turquoise pool at the cliff edge, a single winding road reaching them, clouds pooling in the valleys on both sides, early morning light, rugged and exclusive."),
        dict(id="grid-details", title="Materials", section="Materials band", ar="1:1", grid=True, camera="Macro, side light",
             prompt=GRID + "Material close-ups in cold blue dawn light. Top-left: split-face basalt stone with fine texture. Top-right: the junction of a smoked oak soffit and a black steel frame. Bottom-left: a thick oatmeal wool throw. Bottom-right: frost crystals on a pane of glass with clouds blurred behind."),
        dict(id="grid-mountain", title="The mountain", section="Around Jebel Jais", ar="3:4", grid=True, camera="Outdoor, 35mm",
             prompt=GRID + "The mountains of Ras Al Khaimah at dawn, people small or seen from behind, all different. Top-left: a hiker on a stony trail along a ridge above the clouds. Top-right: a long zip line cable vanishing across a misty canyon. Bottom-left: a small stone mountain cafe with a terrace in the early sun. Bottom-right: a lone viewpoint platform above layers of blue ridges."),
    ],
)

# ─────────────────────────────────────────────── 029 SANDBAR ONE
SITES["sandbar-one"] = dict(
    name="SANDBAR ONE",
    premise="A private island off Abu Dhabi with twelve beach villa plots and a marina; a plot picker, villa designs and an enquiry.",
    look="bright aerial and water-level island photography, saturated turquoise shallows, white sand, midday clarity and soft dusk, drone and 24mm, photorealistic",
    palette="turquoise, white sand, palm green, sun-bleached teak and soft coral",
    direction="An island you arrive at by boat. Seen first from the air as a white sandbar in gradients of turquoise, then at water level where the shallows are so clear that boats seem to float on air. Architecture is low and white, shaded by palm-thatch pavilions, so the sea always dominates. Bright, clean, effortless luxury; dusk adds the romance.",
    type="light, open sans capitals with plenty of tracking; layouts with big turquoise fields and very little chrome.",
    anchor_name="island",
    anchor="a small low private island of white sand ringed by turquoise shallows, twelve low white villas with flat roofs and palm-thatch shade pavilions spaced along the beach, a crescent-shaped teak marina with a few white motor yachts, a central grove of date palms, a long sandbank trailing off the northern tip, in the Arabian Gulf off Abu Dhabi",
    consistency=["Generate 01 first; keep the island description word for word in every aerial and wide shot.",
                 "Villa shots repeat the same villa: a low white flat-roofed villa with a palm-thatch pavilion and a pool that steps down into the sea."],
    shots=[
        dict(id="hero", title="The island", section="Home hero, full screen", ar="16:9", camera="Drone, 250 m, 45 degrees",
             prompt="Aerial drone photograph of {anchor}, seen at a 45-degree angle in bright late-morning sun: gradients from deep blue to vivid turquoise to pale aqua around the white sand, the villas and palms in neat rhythm, the marina crescent with yachts, a speedboat leaving a white wake, crystal clear and luxurious."),
        dict(id="hero-mobile", title="The sandbank", section="Home hero on phones", ar="9:16", camera="Drone, straight down",
             prompt="Vertical top-down drone photograph of a long white sandbank curving through clear turquoise water like a brushstroke, ripples and sand patterns visible beneath the surface, the shadow of a small boat on the seabed beside it, minimal and graphic."),
        dict(id="arrival", title="Arriving by water", section="Arrival section", ar="3:2", camera="Water level, 35mm",
             prompt="Photograph at water level of a classic teak motor launch gliding up to a teak jetty on {anchor}, the water so clear that the boat's shadow is visible on the white sand below, palms and a white villa on the beach ahead, bright midday sun, effortless and exclusive."),
        dict(id="villa", title="A beach villa", section="Villa designs", ar="16:9", camera="Architectural, 24mm",
             prompt="Architectural photograph of a low white flat-roofed beach villa on {anchor}: a palm-thatch shade pavilion with linen loungers, a long pool that steps down into the turquoise sea, sun-bleached teak decking, a pair of leaning palms, soft midday light, nobody present."),
        dict(id="living", title="The living room", section="Villa interiors", ar="16:9", camera="Interior, 24mm",
             prompt="Interior photograph of a beach villa living room with smooth white lime plaster, sun-bleached teak, linen sofas and rattan chairs, wide glass doors fully open onto the sand and the turquoise sea, a coral-coloured cushion, a breeze moving a sheer curtain, bright and airy, nobody present."),
        dict(id="grid-villa", title="The villa", section="Villa gallery", ar="16:9", grid=True, camera="Interiors and courtyards, 28mm",
             prompt=GRID + "A white beach villa with teak, linen and palm-thatch, bright daylight, nobody present. Top-left: a bedroom with a linen bed facing open doors and the sea. Top-right: an outdoor shower in a walled courtyard of palms and white plaster. Bottom-left: a dining pavilion with a long teak table under palm thatch by the water. Bottom-right: a bathroom with a stone basin and a window onto the shallows."),
        dict(id="dusk", title="Dusk", section="Evening band", ar="21:9", camera="Wide, 24mm, from the water",
             prompt="Panoramic photograph of {anchor} at dusk from the water: the sky in soft coral and violet, the villas glowing warm, the palms silhouetted, the sea glassy and still with reflections, a yacht at anchor with its lights on, serene and romantic."),
        dict(id="sandbar-walk", title="Low tide", section="Life on the island", ar="3:2", camera="50mm, from behind",
             prompt="Photograph from behind of a family of three generations walking barefoot along a wet white sandbank at low tide, all faces turned away, turquoise water on both sides, their reflections in the thin film of water, soft late-afternoon light, carefree."),
        dict(id="grid-sea", title="The sea", section="Around the island", ar="1:1", grid=True, camera="Underwater, aerial and water level",
             prompt=GRID + "The sea around a private island in the Arabian Gulf, bright light. Top-left: small reef fish over coral and sea grass in clear water. Top-right: a white seaplane resting on turquoise water. Bottom-left: a paddleboarder seen from above on glassy water, face not visible. Bottom-right: a traditional wooden dhow sailing past with a white sail."),
        dict(id="plot", title="An empty plot", section="Plot picker", ar="4:3", camera="Eye level, 35mm",
             prompt="Photograph of a vacant beachfront plot on {anchor}: smooth white sand marked by four small wooden survey stakes with white string between them, two date palms, the turquoise shallows a few steps away, a neighbouring white villa just visible at the edge, clear bright light, full of promise."),
    ],
)

# ─────────────────────────────────────────────── 027 THE LAST FLOOR
SITES["the-last-floor"] = dict(
    name="THE LAST FLOOR",
    premise="One full-floor penthouse at the top of a Downtown Dubai supertall, and nothing else for sale; a penthouse explorer and a private viewing.",
    look="dramatic night-time luxury interior photography from 300 metres up, city lights and reflections in glass, deep blacks, 24mm long exposure, photorealistic",
    palette="obsidian black, smoked bronze, champagne gold, deep emerald velvet and midnight blue",
    direction="The city is the wallpaper. Everything is shot at blue hour or night from the top floor: black marble that reflects the skyline, smoked bronze fins, deep green velvet and a pool that seems to pour into the lights below. It should feel like the last word in privacy and height: dark, glossy, cinematic, with dawn used once as a quiet counterpoint.",
    type="high-contrast didone capitals in champagne on black; thin rules; very few words per screen.",
    anchor_name="penthouse",
    anchor="a full-floor penthouse at the top of a slender supertall tower in Downtown Dubai: floor-to-ceiling glass on all four sides, black marble floors with white veins, smoked bronze ceiling fins, a sunken living room with curved deep-emerald velvet sofas, a wraparound terrace with frameless glass balustrades and a black-tiled infinity pool, the city lights spread out three hundred metres below",
    consistency=["Generate 01 first; keep the penthouse description word for word.",
                 "Night shots are all at the same blue hour turning to night; only the dawn shot breaks this."],
    shots=[
        dict(id="hero", title="The sunken room at night", section="Home hero, full screen", ar="16:9", camera="Interior, 24mm, long exposure",
             prompt="Cinematic night interior photograph of {anchor}: the sunken living room with curved emerald velvet sofas in the foreground, the glass wall behind showing the glittering grid of city lights far below and the illuminated towers around, the skyline reflected in the black marble floor, warm low lamps and cool blue night outside, opulent and silent, nobody present."),
        dict(id="hero-mobile", title="The pool edge", section="Home hero on phones", ar="9:16", camera="Water level, 24mm",
             prompt="Vertical night photograph along the black-tiled infinity pool on the terrace of {anchor}: the water edge disappearing into the city lights three hundred metres below, a neighbouring tower's lit spire rising in the frame, the pool lit softly from beneath, a dramatic sense of height."),
        dict(id="pool", title="The terrace pool", section="Terrace section", ar="21:9", camera="Wide, 20mm, blue hour",
             prompt="Panoramic blue-hour photograph across the terrace of {anchor}: the black infinity pool merging with the city lights, frameless glass balustrades, two low loungers, the last band of orange light on the horizon and the towers lighting up one by one, nobody present."),
        dict(id="tower", title="The top of the tower", section="The building", ar="3:4", camera="Telephoto from a distance, 200mm",
             prompt="Telephoto photograph at dusk of the crown of a slender supertall tower of glass and bronze in Downtown Dubai, only the top floor glowing warm gold while the floors below are cooler, thin bronze vertical fins, a deep blue sky with a sliver of moon, elegant and singular."),
        dict(id="grid-rooms", title="Rooms", section="Penthouse explorer", ar="16:9", grid=True, camera="Interiors, 24mm, night",
             prompt=GRID + "Night interiors of a full-floor penthouse with black marble, smoked bronze and emerald velvet, the city lights far below through every window, nobody present. Top-left: the principal bedroom with a low bed facing a glass corner onto the skyline. Top-right: a dining room with a long black marble table and a sculptural bronze pendant. Bottom-left: a library bar with bronze shelving and a velvet armchair. Bottom-right: a bathroom with a black marble bathtub against the glass."),
        dict(id="dawn", title="Dawn", section="Morning band", ar="16:9", camera="Interior, 24mm",
             prompt="Interior photograph of {anchor} at dawn: soft pink and pale gold light flooding across the black marble, mist lying over the city far below, the towers emerging from haze, the emerald sofas catching the first light, calm and luminous, nobody present."),
        dict(id="evening", title="An evening on the terrace", section="Life up here", ar="3:2", camera="50mm, night",
             prompt="Night photograph on the terrace of {anchor}: a host pouring sparkling juice into glasses for three guests standing by the glass balustrade, all different people dressed for evening, faces turned away or in shadow, the city lights spread below them, candle lanterns on a low table, glamorous and relaxed."),
        dict(id="grid-details", title="Materials", section="Materials band", ar="1:1", grid=True, camera="Macro, low light",
             prompt=GRID + "Material close-ups in low warm light with city lights blurred behind. Top-left: black marble with fine white veins. Top-right: a smoked bronze fin with soft reflections. Bottom-left: deep emerald velvet upholstery. Bottom-right: a pane of glass reflecting the night skyline."),
        dict(id="lift", title="The private lift", section="Arrival section", ar="3:4", camera="Symmetrical, 35mm",
             prompt="Symmetrical photograph of a private lift lobby: tall smoked bronze lift doors opening onto a black marble hall, a single sculptural bronze bench, a slim line of warm light along the ceiling, and through an open doorway beyond, a glimpse of the night skyline, hushed and exclusive."),
        dict(id="view", title="The view", section="Full-width view band", ar="21:9", camera="Panoramic, 35mm, blue hour",
             prompt="Panoramic blue-hour photograph of the Dubai skyline seen from three hundred metres up, through floor-to-ceiling glass with the faintest reflection of a bronze fin at the edge: illuminated towers, the lit grid of streets and a long boulevard of lights curving away, deep blue sky with a last glow on the horizon."),
    ],
)

# ─────────────────────────────────────────────── 030 KEYS & SAND
SITES["keys-and-sand"] = dict(
    name="KEYS & SAND",
    premise="Six design-led holiday apartments by the sea in Dubai, booked direct instead of through the big platforms: stay search, apartment pages and booking.",
    look="bright, sunlit, lived-in holiday interior photography like a design-hotel campaign, natural light, soft shadows, 28-35mm, photorealistic",
    palette="chalk white, sea blue, sand, terracotta and natural rattan",
    direction="The anti-listing. Instead of wide-angle rental photos, every apartment is shot like a design magazine story: morning light, an open book, linen moving in the breeze, the sea always in the frame. Six apartments, each with one signature colour against chalk white. The site should make a guest want to book direct for the feeling, not the price.",
    type="friendly rounded serif headlines, handwritten-feeling numerals for nights and guests; warm off-white backgrounds.",
    anchor_name="building",
    anchor="a low, five-storey whitewashed apartment building right on a sandy beach in Dubai, with deep curved balconies, sea-blue painted shutters, built-in planters of bougainvillea and olive, and a quiet sea-facing courtyard with a small pool",
    consistency=["Generate 01 first; keep the building description word for word in exterior shots.",
                 "Interiors share chalk-white walls, oak floors, linen and rattan; each apartment adds one colour (sea blue, terracotta or sand) as noted."],
    shots=[
        dict(id="hero", title="Morning on the balcony", section="Home hero, full screen", ar="16:9", camera="Interior to balcony, 28mm",
             prompt="Bright photograph from inside a holiday apartment out through open glass doors to a deep curved balcony of {anchor}: two rattan chairs, a small table with coffee and a bowl of figs, sheer linen curtains lifting in the breeze, the turquoise sea and a pale sandy beach beyond, warm morning sun, relaxed and inviting, nobody present."),
        dict(id="hero-mobile", title="The shutters", section="Home hero on phones", ar="9:16", camera="Vertical, 35mm",
             prompt="Vertical photograph of a tall window with sea-blue painted shutters folded open on a white wall, a branch of bougainvillea across the corner, a slice of turquoise sea and sky through the window, a linen curtain moving, bright morning light, fresh and holiday-like."),
        dict(id="building", title="The building", section="About the homes", ar="3:2", camera="From the beach, 35mm",
             prompt="Architectural photograph from the beach of {anchor}: soft morning light on the white curves, sea-blue shutters half open, bougainvillea spilling from the planters, a few sun loungers and a striped umbrella on the sand in front, calm sea, nobody posing."),
        dict(id="grid-blue", title="The Blue Apartment", section="Apartment page: Blue", ar="16:9", grid=True, camera="Interiors, 28mm",
             prompt=GRID + "A two-bedroom holiday apartment by the sea with chalk-white walls, oak floors, linen and rattan, accents of deep sea blue, bright natural light, nobody present. Top-left: the living room with a blue linen sofa and the sea through open doors. Top-right: a small kitchen with blue tiles and a bowl of lemons. Bottom-left: a bedroom with white linen and a blue throw facing the sea. Bottom-right: a shower room with blue zellige tiles and a round mirror."),
        dict(id="grid-terracotta", title="The Terracotta Apartment", section="Apartment page: Terracotta", ar="16:9", grid=True, camera="Interiors, 28mm",
             prompt=GRID + "A one-bedroom holiday apartment by the sea with chalk-white walls, oak floors, linen and rattan, accents of warm terracotta, bright natural light, nobody present. Top-left: a living area with a terracotta armchair and a reading lamp. Top-right: a dining nook with a round oak table and terracotta jugs of dried flowers. Bottom-left: a bedroom with a rattan headboard and terracotta linen. Bottom-right: a bathroom with a terracotta tiled floor and a wooden stool."),
        dict(id="grid-sand", title="The Sand Penthouse", section="Apartment page: Penthouse", ar="16:9", grid=True, camera="Interiors and roof, 24mm",
             prompt=GRID + "A three-bedroom holiday penthouse by the sea with chalk-white walls, oak, linen and rattan in warm sand tones, bright natural light, nobody present. Top-left: a double-height living room with a curved sand-coloured sofa and the sea beyond. Top-right: a roof terrace with a plunge pool and sun loungers. Bottom-left: a family bedroom with two beds and striped linen. Bottom-right: an outdoor dining table under a white pergola at sunset."),
        dict(id="courtyard", title="The courtyard pool", section="Shared spaces", ar="4:3", camera="35mm, afternoon",
             prompt="Photograph of the quiet sea-facing courtyard of {anchor}: a small turquoise pool edged in white stone, olive trees in white planters, a few linen loungers, bougainvillea on the walls, afternoon light and soft shadows, peaceful, nobody present."),
        dict(id="arrival", title="Welcome", section="Your stay: arrival", ar="3:2", camera="50mm, detail",
             prompt="Close photograph of a welcome on an oak console in a holiday apartment: a brass key on a sea-blue tassel, a handwritten welcome card left blank, a bowl of local dates, a small jug of fresh flowers, a folded beach towel tied with string, warm afternoon light."),
        dict(id="guests", title="Holiday life", section="Guest moments", ar="3:2", camera="35mm, candid",
             prompt="Candid photograph of a couple and their young child on the beach in front of {anchor} at golden hour, building a sandcastle, all faces turned away or out of frame, soft warm light, the white building and blue shutters behind them, joyful and natural."),
        dict(id="grid-neighbourhood", title="The neighbourhood", section="Around you", ar="1:1", grid=True, camera="Street and beach, 35mm",
             prompt=GRID + "A seaside neighbourhood in Dubai in bright light, people small or seen from behind, all different. Top-left: a quiet beach at early morning with footprints in the sand. Top-right: a seaside walkway with palm trees and cyclists. Bottom-left: a small cafe counter with pastries and coffee. Bottom-right: a fresh fruit stall with mangoes and pomegranates."),
    ],
)

if __name__ == "__main__":
    for slug, o in SITES.items():
        o["status"] = STATUS
        for x in o["shots"]:
            if PEOPLE.split(" so ")[0] not in x["prompt"] and any(w in x["prompt"] for w in (" couple", " family", " guests", " host ", " rider", " groom ", " hiker", " cyclists", " paddleboarder")):
                x["prompt"] += " " + PEOPLE
        json.dump(o, open(os.path.join(OUT, f"{slug}-prompts.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(slug, len(o["shots"]), "shots")

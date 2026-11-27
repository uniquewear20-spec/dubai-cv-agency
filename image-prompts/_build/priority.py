# Writes image-prompts/SEEDREAM-PRIORITY.md: the order to generate in while Seedream 5.0 Pro is
# unlimited (until 30 Nov 2026), every prompt on one page so you can work straight down it.
import json, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BATCHES = [
    ("Batch 1", "the next site to build, then the strongest real-estate concepts", [
        ("kai-8", "Next website in the build order"),
        ("sahra-stables", "Real estate: desert equestrian estate"),
        ("cloudline", "Real estate: villas above the clouds"),
        ("sandbar-one", "Real estate: private island"),
        ("the-last-floor", "Real estate: one penthouse"),
        ("keys-and-sand", "Real estate: design-led holiday homes, booked direct"),
    ]),
    ("Batch 2", "six more real-estate sites, each a different market and light", [
        ("riad-seven-fountains", "Real estate: restored riads in the Marrakech medina"),
        ("qurum-cliff", "Real estate: cliff villas above the sea in Muscat"),
        ("berth-40", "Real estate: homes with their own yacht berth"),
        ("canal-house-12", "Real estate: brick loft apartments on the Dubai canal"),
        ("chalet-1870", "Real estate: a restored Swiss chalet"),
        ("mews-22", "Real estate: one Mayfair mews house"),
    ]),
]
L = ["# Seedream 5.0 Pro: what to generate first", "",
     "Seedream 5.0 Pro is unlimited on your plan until **30 Nov 2026**. This page is the order to work in, with every prompt in one place: copy, generate, move to the next. Each site's own page has the same prompts plus its creative direction.", "",
     "## Settings, every time", "",
     "Higgsfield website → Image → **Seedream 5.0 Pro** · Quality **2K** · Count **1/4** (keep 1/4 so Unlimited stays on) · **Unlimited on** · set the ratio shown · no reference images.",
     "Unlimited runs one picture at a time and queues one more, so start the next as soon as one finishes. Grids (2x2) give four pictures in one go.", "",
     "If a picture is wrong (text, a logo, a repeated face, a warped building), generate it again with the same prompt. Nothing to download or rename: Claude finds every picture in your library by its prompt.", "",
     "## Order", ""]
total_g = total_i = 0
blocks = []
i = 0
for label, about, order in BATCHES:
    bg = bi = 0
    L += [f"### {label}: {about}", ""]
    for slug, why in order:
        folder = next(iter(glob.glob(os.path.join(ROOT, f"*-{slug}"))), None)
        if not folder:
            continue
        i += 1
        d = json.load(open(os.path.join(folder, "prompts.json"), encoding="utf-8"))
        g = len(d["shots"]); im = sum(4 if s["kind"] == "grid" else 1 for s in d["shots"])
        bg += g; bi += im
        name = os.path.basename(folder)
        L.append(f"{i}. **{d['site']}** ({why}): {g} generations, {im} pictures · [site page](./{name}/prompts.md)")
        B = [f"## {i}. {d['site']}", "", f"*{d['concept']}*", ""]
        for s in d["shots"]:
            B += [f"### {d['site']} {s['n']:02d} · {s['title']}  ·  ratio {s['ar']}{'  ·  2x2 grid' if s['kind'] == 'grid' else ''}", "",
                  f"For: {s['section']}", "", "```text", s["prompt"], "```", ""]
        blocks += B
    L += ["", f"{label}: **{bg} generations, {bi} pictures.**", ""]
    total_g += bg; total_i += bi
L += [f"All batches so far: **{total_g} generations, {total_i} pictures.** More batches are added to this page as they are written.", ""]
open(os.path.join(ROOT, "SEEDREAM-PRIORITY.md"), "w", encoding="utf-8").write("\n".join(L + blocks))
print("priority page:", total_g, "generations,", total_i, "pictures")

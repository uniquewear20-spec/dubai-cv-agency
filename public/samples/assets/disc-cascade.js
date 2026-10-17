/* Disc Cascade Carousel: a plain-JS port of components/ui/disc-cascade-carousel.tsx (the client's React
   component), for the static concept sites. Same engine and look: one position chased by two springs (a stiff
   one for the slide, a looser one for depth, turn and roll), discs on a slanted line that climbs toward you,
   generated SVG label art, credits + press quotes that change over, drag / flick / sideways swipe / arrow keys /
   Index menu / buttons, idle spin and a moving glint.

   usage: const dc = new DiscCascade(rootElement, { items, ...options });  dc.goTo(i); dc.step(1); dc.destroy();
   Options mirror the React props (height, discSize, spacing, rise, depth, yaw, fan, tilt, roll, spin, sheen,
   bounce, duration, loop, autoplay, brand, nav, navActive, indexLabel, details, reviews, controls, hint, frame,
   background, color, serif, sans, display, defaultIndex, onIndexChange, onSelect, ariaLabel, itemNoun). */
(function () {
  "use strict";

  // ---- motion (identical maths to the component) ----
  function wrapIndex(i, n) { return n <= 0 ? 0 : ((i % n) + n) % n; }
  function indexAt(pos, n, loop) { if (n <= 0) return 0; var i = Math.round(pos); return loop ? wrapIndex(i, n) : Math.min(Math.max(i, 0), n - 1); }
  function offsetOf(i, pos, n, loop) { var d = i - pos; return loop && n > 0 ? d - n * Math.round(d / n) : d; }
  function rubber(pos, n) { if (pos < 0) return pos / 3; if (pos > n - 1) return n - 1 + (pos - (n - 1)) / 3; return pos; }
  function springOf(bounce, duration) { var b = Math.min(Math.max(bounce, 0), 0.9); return { omega: (2 * Math.PI) / Math.max(duration, 0.1), slide: 1 - b / 2, tilt: 1 - b }; }
  function springStep(x, v, target, omega, zeta, dt) {
    var steps = Math.max(1, Math.ceil(dt / (1 / 240))), h = dt / steps;
    for (var k = 0; k < steps; k++) { v += (-omega * omega * (x - target) - 2 * zeta * omega * v) * h; x += v * h; }
    return [x, v];
  }
  function releaseTarget(pos, velocity, n, loop) {
    var here = Math.round(pos), t = Math.round(pos + velocity * 0.2);
    t = Math.min(Math.max(t, here - 3), here + 3);
    return loop ? t : Math.min(Math.max(t, 0), n - 1);
  }
  function targetFor(i, target, n, loop) {
    if (!loop) return Math.min(Math.max(i, 0), n - 1);
    var here = Math.round(target), d = i - wrapIndex(here, n);
    d -= n * Math.round(d / n);
    return here + d;
  }
  function poseOf(dx, d, c) {
    var near = Math.min(d, 2.2);
    return {
      x: dx * c.spacing, y: -dx * c.rise, z: near * c.depth, yaw: c.yaw + d * c.fan, roll: d * c.roll,
      zIndex: 100 + Math.round(d * 10),
      opacity: d < -2.5 ? Math.max(0, 1 - (-d - 2.5) / 1.2) : 1,
      hidden: dx < -4 || dx > 2.8
    };
  }

  // ---- art ----
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0; var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function inkFor(bg) {
    var m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(bg).trim());
    if (!m) return "#ffffff";
    var h = m[1].length === 3 ? m[1].replace(/./g, function (c) { return c + c; }) : m[1];
    function lin(i) { var v = parseInt(h.slice(i, i + 2), 16) / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    var L = 0.2126 * lin(0) + 0.7152 * lin(2) + 0.0722 * lin(4);
    return L > 0.36 ? "#111111" : "#ffffff";
  }
  function wrapLabel(text, max) {
    var out = [], cur = "";
    text.trim().split(/\s+/).forEach(function (w) {
      if (!w) return;
      if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w;
    });
    if (cur) out.push(cur);
    return out;
  }
  function fitSize(chars, room, max) { return Math.max(6, Math.min(max, room / (Math.max(chars, 1) * 0.56))); }
  function textWidth(chars, fs) { return Math.max(chars, 1) * fs * 0.56; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function lines(v) { return Array.isArray(v) ? v : [v]; }

  var PATTERNS = ["horizon", "mosaic", "eclipse", "sunburst", "halftone", "rings", "stripes"];
  var PALETTES = [
    ["#1b1d1f", "#3f6b3a", "#c9d6c4"], ["#f2e3c6", "#d2452b", "#2a5d8f"], ["#141414", "#e9e4da", "#c8a24a"],
    ["#f0c94c", "#e8572b", "#2b2622"], ["#e9e6df", "#1d1d1d", "#d84b3c"], ["#2d3f7a", "#e8b4c8", "#f4efe6"], ["#d9e3df", "#16443f", "#f08a5d"]
  ];

  function wedge(a0, a1, r) {
    function p(a) { return (100 + r * Math.cos(a)).toFixed(2) + " " + (100 + r * Math.sin(a)).toFixed(2); }
    return "M100 100L" + p(a0) + "A" + r + " " + r + " 0 0 1 " + p(a1) + "Z";
  }
  function art(pattern, pal, seed, uid) {
    var bg = pal[0], fg = pal[1], ac = pal[2], r = rng(seed * 9973 + 17), o = ['<rect width="200" height="200" fill="' + bg + '"/>'], i, x, y, j;
    if (pattern === "sunburst") {
      var k = 28;
      for (i = 0; i < k; i += 2) o.push('<path d="' + wedge((i / k) * Math.PI * 2, ((i + 1) / k) * Math.PI * 2, 142) + '" fill="' + fg + '"/>');
      o.push('<circle cx="100" cy="100" r="44" fill="' + ac + '"/><circle cx="100" cy="100" r="40.5" fill="none" stroke="' + bg + '" stroke-width="1.6" stroke-dasharray="2 3.5"/>');
    } else if (pattern === "rings") {
      for (var rr = 100, n = 0; rr > 36; rr -= 7, n++) o.push('<circle cx="100" cy="100" r="' + rr + '" fill="' + (n % 3 === 2 ? ac : n % 2 ? bg : fg) + '"/>');
    } else if (pattern === "halftone") {
      var fx = 50 + r() * 100, fy = 30 + r() * 60;
      for (y = 4; y < 200; y += 8) for (x = 4 + ((y / 8) % 2) * 4; x < 200; x += 8) {
        var rad = Math.max(0, 3.9 - Math.hypot(x - fx, y - fy) / 34);
        if (rad > 0.3) o.push('<circle cx="' + x + '" cy="' + y + '" r="' + rad.toFixed(2) + '" fill="' + fg + '"/>');
      }
      o.push('<circle cx="' + fx + '" cy="' + fy + '" r="16" fill="' + ac + '"/>');
    } else if (pattern === "horizon") {
      o.push('<linearGradient id="' + uid + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + bg + '"/><stop offset=".62" stop-color="' + ac + '"/></linearGradient>');
      o.push('<rect width="200" height="200" fill="url(#' + uid + 'sky)"/><circle cx="' + (60 + r() * 80) + '" cy="112" r="20" fill="#f6efe0" opacity=".85"/>');
      x = -4;
      while (x < 204) {
        var h = 18 + r() * 34, w = 7 + r() * 9;
        if (r() > 0.45) o.push('<ellipse cx="' + x + '" cy="' + (128 - h) + '" rx="' + w + '" ry="' + w * 1.1 + '" fill="' + fg + '"/>');
        else o.push('<path d="M' + x + " " + (130 - h * 1.35) + "L" + (x + w * 0.55) + " 130L" + (x - w * 0.55) + ' 130Z" fill="' + fg + '"/>');
        o.push('<rect x="' + (x - 0.9) + '" y="' + (128 - h) + '" width="1.8" height="' + h + '" fill="' + fg + '"/>');
        x += w * (0.9 + r() * 0.8);
      }
      o.push('<rect y="128" width="200" height="72" fill="' + fg + '"/>');
      for (j = 0; j < 40; j++) o.push('<circle cx="' + (r() * 200).toFixed(1) + '" cy="' + (132 + r() * 66).toFixed(1) + '" r="' + (0.6 + r() * 1.2).toFixed(2) + '" fill="' + ac + '" opacity=".8"/>');
    } else if (pattern === "stripes") {
      var g = [];
      for (i = -10; i < 20; i++) g.push('<rect x="' + i * 14 + '" y="-60" width="7" height="320" fill="' + (i % 4 === 0 ? ac : fg) + '"/>');
      o.push('<g transform="rotate(' + (20 + r() * 40).toFixed(1) + ' 100 100)">' + g.join("") + "</g>");
    } else if (pattern === "eclipse") {
      for (j = 0; j < 70; j++) o.push('<circle cx="' + (r() * 200).toFixed(1) + '" cy="' + (r() * 200).toFixed(1) + '" r="' + (0.3 + r() * 0.9).toFixed(2) + '" fill="' + fg + '" opacity="' + (0.3 + r() * 0.7).toFixed(2) + '"/>');
      o.push('<circle cx="100" cy="100" r="78" fill="none" stroke="' + ac + '" stroke-width="1" opacity=".6"/><circle cx="100" cy="100" r="66" fill="' + fg + '"/><circle cx="118" cy="88" r="62" fill="' + bg + '"/><circle cx="100" cy="100" r="66" fill="none" stroke="' + ac + '" stroke-width="1.4" stroke-dasharray="1 3"/>');
    } else {
      var cols = [bg, fg, ac];
      for (y = 0; y < 200; y += 20) for (x = 0; x < 200; x += 20) {
        var c = cols[Math.floor(r() * 3)], kind = r();
        o.push('<rect x="' + x + '" y="' + y + '" width="20" height="20" fill="' + c + '"/>');
        if (kind > 0.7) o.push('<circle cx="' + (x + 10) + '" cy="' + (y + 10) + '" r="7" fill="' + cols[(cols.indexOf(c) + 1) % 3] + '"/>');
        else if (kind > 0.45) o.push('<path d="M' + x + " " + y + "h20L" + x + " " + (y + 20) + '" fill="' + cols[(cols.indexOf(c) + 2) % 3] + '"/>');
      }
    }
    return o.join("");
  }
  function print(item, i, uid, mark, ink, halo) {
    var label = String(item.label != null ? item.label : item.title).toUpperCase();
    var fine = String(item.fine != null ? item.fine : (item.credits || []).map(function (c) { return c.label + " " + lines(c.value).join(", "); }).join("  ·  ")).toUpperCase();
    function ring(w) { return ' stroke="' + halo + '" stroke-width="' + (item.src ? w * 0.4 : w) + '" stroke-linejoin="round" paint-order="stroke"'; }
    var head = "";
    if (label && (item.labelStyle || "arc") === "arc") {
      var fs = fitSize(label.length, 226 * 0.86, 21);
      head = '<text fill="' + ink + '" font-size="' + fs.toFixed(2) + '" font-weight="700" text-anchor="middle" textLength="' + textWidth(label.length, fs).toFixed(1) + '" lengthAdjust="spacingAndGlyphs"' + ring(2.4) + '><textPath href="#' + uid + 'top" startOffset="50%">' + esc(label) + "</textPath></text>";
    } else if (label) {
      var ls = wrapLabel(label, 11).slice(0, 3);
      var fs2 = Math.min(fitSize(Math.max.apply(null, ls.map(function (l) { return l.length; })), 112, 20), 32 / (ls.length * 0.98));
      var lh = fs2 * 0.98, y0 = 58 - (ls.length - 1) * lh;
      head = '<g fill="' + ink + '" font-size="' + fs2.toFixed(2) + '" font-weight="700"' + ring(2.4) + ">" + ls.map(function (l, k) {
        var y = y0 + k * lh, room = 2 * Math.sqrt(Math.max(0, 86 * 86 - Math.pow(100 - y + fs2 * 0.35, 2)));
        return '<text x="100" y="' + y.toFixed(2) + '" text-anchor="middle" textLength="' + Math.min(textWidth(l.length, fs2), room).toFixed(1) + '" lengthAdjust="spacingAndGlyphs">' + esc(l) + "</text>";
      }).join("") + "</g>";
    }
    var s = '<svg viewBox="0 0 200 200" aria-hidden="true" style="max-width:none"><defs><path id="' + uid + 'top" d="M28 100a72 72 0 1 1 144 0"/><path id="' + uid + 'bot" d="M14 100a86 86 0 0 0 172 0"/></defs>' + head;
    if (fine) s += '<text fill="' + ink + '" font-size="5.2" letter-spacing=".7" text-anchor="middle" opacity=".86"' + ring(1.2) + '><textPath href="#' + uid + 'bot" startOffset="50%">' + esc(fine.length > 120 ? fine.slice(0, 118) + "…" : fine) + "</textPath></text>";
    if (mark) s += '<text x="100" y="150" fill="' + ink + '" font-size="10" font-weight="800" letter-spacing="-.4" text-anchor="middle"' + ring(1.2) + ">" + esc(mark) + "</text>";
    if (!item.src) s += '<text x="100" y="64" fill="' + ink + '" font-size="4" letter-spacing="1.2" text-anchor="middle" opacity=".6" transform="rotate(180 100 100)">DISC ' + pad(i + 1) + "</text>";
    return s + "</svg>";
  }
  function hub(uid) {
    return '<svg class="dcc-hub" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="' + uid + 'metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbfbfc"/><stop offset=".45" stop-color="#a9adb3"/><stop offset=".55" stop-color="#eef0f2"/><stop offset="1" stop-color="#8f949a"/></linearGradient></defs>' +
      '<circle cx="100" cy="100" r="35.5" fill="none" stroke="url(#' + uid + 'metal)" stroke-width="4"/><circle cx="100" cy="100" r="25.5" fill="rgba(232,235,239,.82)" stroke="rgba(232,235,239,.82)" stroke-width="16"/>' +
      '<circle cx="100" cy="100" r="17.6" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="1.4"/><circle cx="100" cy="100" r="22" fill="none" stroke="rgba(0,0,0,.12)" stroke-width=".6"/>' +
      '<circle cx="100" cy="100" r="27" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.6"/><circle cx="100" cy="100" r="28.6" fill="none" stroke="rgba(0,0,0,.1)" stroke-width=".6"/>' +
      '<circle cx="100" cy="100" r="33.3" fill="none" stroke="rgba(0,0,0,.16)" stroke-width=".7"/><circle cx="100" cy="100" r="99.3" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.2"/></svg>';
  }
  /** The markup of one disc face (label + print + hub + sheen): exported so a page can show a matching disc elsewhere. */
  function discFace(item, i, opts) {
    opts = opts || {};
    var uid = (opts.uid || "dccx") + "d" + i;
    var pal = item.palette || PALETTES[i % PALETTES.length];
    var ink = item.ink || (item.src ? "#ffffff" : inkFor(pal[0]));
    var label = item.src
      ? '<img src="' + esc(item.src) + '" alt="' + esc(item.alt || item.title) + '" draggable="false" decoding="async" width="600" height="600" style="max-width:none">'
      : '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(item.alt || item.title) + '" style="max-width:none">' + art(item.pattern || PATTERNS[i % PATTERNS.length], pal, i + 1, uid) + "</svg>";
    return '<span class="dcc-shade"></span><span class="dcc-edge"></span><span class="dcc-disc"><span class="dcc-roll"><span class="dcc-idle" style="font-family:' + esc(opts.display || "") + '">' + label +
      print(item, i, uid, opts.brand || "", ink, item.src ? "rgba(0,0,0,.45)" : pal[0]) + "</span></span>" + hub(uid) + '<span class="dcc-sheen"></span></span>';
  }

  var CSS =
    ".dcc-root{position:relative;overflow:hidden;width:100%;container-type:inline-size;color:var(--dcc-fg,#1a1a1a);user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;-webkit-tap-highlight-color:transparent;--dcc-pad:clamp(16px,3.6cqw,44px)}" +
    ".dcc-root:focus-visible{box-shadow:inset 0 0 0 2px currentColor}" +
    ".dcc-root[data-dragging],.dcc-root[data-dragging] .dcc-slide{cursor:grabbing}" +
    ".dcc-frame{position:absolute;inset:calc(var(--dcc-pad) * .45);pointer-events:none;z-index:1;border:1px solid color-mix(in oklab,currentColor 14%,transparent)}" +
    ".dcc-stage{position:absolute;left:50%;top:52%;width:var(--dcc-s);aspect-ratio:1/1;transform:translate(-50%,-50%);perspective:calc(var(--dcc-s) * 3.2)}" +
    ".dcc-slide{position:absolute;inset:0;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;border-radius:50%;cursor:pointer;will-change:transform;transform-style:preserve-3d;-webkit-tap-highlight-color:transparent;outline:none}" +
    ".dcc-tilt{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .5s cubic-bezier(.2,.7,.2,1)}" +
    ".dcc-slide[data-active] .dcc-tilt{transform:translateZ(var(--dcc-lift,0px)) rotateX(calc(var(--dcc-py,0) * -12deg)) rotateY(calc(var(--dcc-px,0) * 12deg))}" +
    ".dcc-slide[data-active]:hover{--dcc-lift:calc(var(--dcc-s) * .05)}" +
    ".dcc-shade{position:absolute;inset:0;border-radius:50%;pointer-events:none;transform:translate3d(0,7%,-18px) scale(.97);background:radial-gradient(circle closest-side,transparent 30%,rgba(0,0,0,.2) 52%,rgba(0,0,0,.1) 80%,transparent 100%)}" +
    ".dcc-edge,.dcc-disc{position:absolute;inset:0;border-radius:50%;-webkit-mask:radial-gradient(circle closest-side,transparent 16.6%,#000 17.1%);mask:radial-gradient(circle closest-side,transparent 16.6%,#000 17.1%)}" +
    ".dcc-edge{transform:translateZ(-4px);background:linear-gradient(160deg,#d7d9dc,#8d9196 55%,#c4c7cb)}" +
    ".dcc-disc{overflow:hidden;background:#cfd2d6;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),inset 0 0 0 2px rgba(0,0,0,.08)}" +
    ".dcc-roll,.dcc-idle{position:absolute;inset:0;border-radius:50%}" +
    ".dcc-roll{transform:rotate(var(--dcc-roll,0deg))}" +
    ".dcc-root[data-spin] .dcc-idle{animation:dcc-spin var(--dcc-spin) linear infinite;animation-play-state:paused}" +
    ".dcc-root[data-spin] .dcc-slide[data-active] .dcc-idle{animation-play-state:running}" +
    ".dcc-root[data-dragging] .dcc-slide .dcc-idle{animation-play-state:paused}" +
    "@keyframes dcc-spin{to{transform:rotate(1turn)}}" +
    ".dcc-idle>img{position:absolute;inset:0;width:100%;height:100%;max-width:none;display:block;object-fit:cover}" +
    ".dcc-idle>svg,.dcc-hub{position:absolute;inset:0;width:100%;height:100%;max-width:none;display:block;overflow:visible}" +
    ".dcc-hub{pointer-events:none}" +
    ".dcc-sheen{position:absolute;inset:0;border-radius:50%;pointer-events:none;mix-blend-mode:screen;opacity:var(--dcc-sheen);background:conic-gradient(from calc(var(--dcc-glint,0deg) + var(--dcc-px,0) * 70deg),transparent 0deg,rgba(255,255,255,.5) 16deg,transparent 38deg,transparent 140deg,rgba(150,215,255,.32) 168deg,rgba(255,170,225,.32) 186deg,rgba(255,236,170,.26) 200deg,transparent 224deg,transparent 360deg),radial-gradient(circle at 32% 24%,rgba(255,255,255,.3),transparent 46%)}" +
    ".dcc-slide:focus-visible .dcc-disc{box-shadow:inset 0 0 0 3px #000,inset 0 0 0 6px currentColor}" +
    ".dcc-nav{position:absolute;top:calc(var(--dcc-pad) * .9);left:50%;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:clamp(12px,1.8cqw,22px);font-size:12px;white-space:nowrap}" +
    ".dcc-brand{font-weight:800;font-size:15px;letter-spacing:-.04em;margin-right:clamp(6px,1.4cqw,18px)}" +
    ".dcc-link{position:relative;color:inherit;text-decoration:none;opacity:.6;transition:opacity .2s;padding:4px 0;background:none;border:0;font:inherit;cursor:pointer}" +
    ".dcc-link:hover,.dcc-link[aria-current]{opacity:1}" +
    ".dcc-link[aria-current]::after{content:\"\";position:absolute;left:50%;bottom:-5px;width:3px;height:3px;margin-left:-1.5px;border-radius:50%;background:currentColor}" +
    ".dcc-menu{position:relative}" +
    ".dcc-menubtn{display:inline-flex;align-items:center;gap:4px;margin:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;cursor:pointer;opacity:.6;transition:opacity .2s}" +
    ".dcc-menubtn:hover,.dcc-menubtn[aria-expanded=true]{opacity:1}" +
    ".dcc-menubtn svg{transition:transform .25s}.dcc-menubtn[aria-expanded=true] svg{transform:rotate(180deg)}" +
    ".dcc-list{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);min-width:240px;margin:0;padding:6px;list-style:none;border-radius:10px;background:var(--dcc-menu-bg,rgba(20,20,22,.88));border:1px solid color-mix(in oklab,currentColor 12%,transparent);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);box-shadow:0 12px 32px -12px rgba(0,0,0,.28);animation:dcc-drop .22s cubic-bezier(.2,.7,.2,1) both}" +
    "@keyframes dcc-drop{from{opacity:0;transform:translate(-50%,-6px)}}" +
    ".dcc-opt{display:flex;align-items:baseline;gap:10px;width:100%;margin:0;padding:7px 10px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;font-size:12px;text-align:left;cursor:pointer}" +
    ".dcc-opt:hover,.dcc-opt:focus-visible{outline:none;background:color-mix(in oklab,currentColor 8%,transparent)}" +
    ".dcc-opt[aria-current] .dcc-optt{font-weight:600}" +
    ".dcc-optn{font-size:10px;opacity:.45;font-variant-numeric:tabular-nums}.dcc-opty{margin-left:auto;font-size:10px;opacity:.45}" +
    ".dcc-head{position:absolute;top:var(--dcc-pad);left:var(--dcc-pad);z-index:4;width:clamp(170px,21cqw,290px);pointer-events:none}" +
    ".dcc-title{margin:0 0 10px;font-weight:400;font-size:clamp(20px,2.5cqw,34px);line-height:.98;letter-spacing:-.01em;text-transform:uppercase;text-wrap:balance}" +
    ".dcc-dl{margin:0}" +
    ".dcc-row{display:flex;justify-content:space-between;gap:12px;padding:5px 0 6px;border-top:1px solid color-mix(in oklab,currentColor 55%,transparent)}" +
    ".dcc-row dt{font-size:7.5px;line-height:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;opacity:.75}" +
    ".dcc-row dd{margin:0;font-size:10.5px;line-height:13px;text-align:right}.dcc-row dd span{display:block}" +
    ".dcc-in{animation:dcc-in .8s cubic-bezier(.2,.7,.1,1) both;animation-delay:calc(var(--i,0) * 60ms)}" +
    "@keyframes dcc-in{from{opacity:0;transform:translateY(12px);filter:blur(5px)}}" +
    ".dcc-revs{position:absolute;bottom:calc(var(--dcc-pad) * 1.1);left:50%;transform:translateX(-50%);z-index:4;display:flex;gap:clamp(24px,7cqw,96px);pointer-events:none}" +
    ".dcc-rev{width:clamp(130px,15cqw,200px);text-align:center;margin:0}" +
    ".dcc-stars{font-size:8px;letter-spacing:3px;margin-bottom:6px}" +
    ".dcc-src{font-size:6.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;margin-bottom:4px}" +
    ".dcc-quote{margin:0;font-size:clamp(13px,1.35cqw,17px);line-height:1.02;text-transform:uppercase;text-wrap:balance}" +
    ".dcc-ctl{position:absolute;right:var(--dcc-pad);bottom:var(--dcc-pad);z-index:5;display:flex;align-items:center;gap:10px}" +
    ".dcc-btn{display:grid;place-items:center;width:34px;height:34px;margin:0;padding:0;border-radius:999px;border:1px solid color-mix(in oklab,currentColor 22%,transparent);background:none;color:inherit;cursor:pointer;transition:background .2s,opacity .2s,transform .2s}" +
    ".dcc-btn:hover:not(:disabled){background:color-mix(in oklab,currentColor 8%,transparent)}.dcc-btn:active:not(:disabled){transform:scale(.9)}.dcc-btn:disabled{opacity:.28;cursor:default}" +
    ".dcc-btn:focus-visible,.dcc-menubtn:focus-visible,.dcc-link:focus-visible{outline:2px solid currentColor;outline-offset:3px}" +
    ".dcc-count{font-size:11px;letter-spacing:.08em;font-variant-numeric:tabular-nums;min-width:58px;text-align:center}.dcc-count b{font-weight:600}" +
    ".dcc-hint{position:absolute;left:var(--dcc-pad);bottom:var(--dcc-pad);z-index:4;font-size:9px;letter-spacing:.18em;text-transform:uppercase;opacity:.45;pointer-events:none;line-height:34px}" +
    ".dcc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
    "@container (max-width:720px){.dcc-link{display:none}.dcc-rev+.dcc-rev{display:none}.dcc-hint{display:none}.dcc-head{width:clamp(150px,44cqw,230px);top:calc(var(--dcc-pad) * 3.2)}.dcc-row:nth-child(n+3){display:none}}" +
    "@container (max-width:420px){.dcc-revs{bottom:calc(var(--dcc-pad) * 4.4)}}" +
    "@media (prefers-reduced-motion:reduce){.dcc-root .dcc-idle{animation:none}.dcc-in,.dcc-list{animation:none}.dcc-tilt,.dcc-btn,.dcc-link,.dcc-menubtn svg{transition:none}}";

  var styled = false;
  function addStyle() { if (styled) return; styled = true; var s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); }
  var ARROW_L = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6"/></svg>';
  var ARROW_R = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
  var CARET = '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  var uidN = 0;

  function DiscCascade(root, o) {
    addStyle();
    var d = {
      height: "100svh", discSize: "clamp(170px, min(50vmin, 38vw), 420px)", spacing: 1.02, rise: 0.24, depth: 0.42, yaw: 22, fan: -10, tilt: -6,
      roll: 110, spin: 24, sheen: 0.6, bounce: 0.22, duration: 0.9, loop: false, autoplay: 0, brand: "", nav: [], navActive: 0, indexLabel: "Index",
      details: true, reviews: true, controls: true, hint: "Drag to browse", frame: true, background: "#111", color: "#eee",
      serif: '"Instrument Serif", Georgia, serif', sans: "system-ui, sans-serif", display: '"Oswald", Impact, sans-serif', defaultIndex: 2,
      ariaLabel: "Catalogue", itemNoun: "item"
    };
    for (var k in o) d[k] = o[k];
    var self = this, items = d.items || [], n = items.length, uid = "dcc" + (++uidN);
    var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    var start = Math.min(Math.max(Math.round(d.defaultIndex), 0), Math.max(n - 1, 0));
    var E = { a: start, va: 0, b: start, vb: 0, target: start, raf: 0, last: 0, size: 300, reduced: reducedMQ.matches, drag: null, clickBlock: false, wheel: 0, wheelAt: 0, stepAt: 0 };
    var st = { active: start, dragging: false, stopped: false, focused: false, visible: true, menu: false };
    this.opts = d;

    root.classList.add("dcc-root");
    root.style.height = d.height; root.style.background = d.background; root.style.color = d.color; root.style.fontFamily = d.sans;
    root.style.setProperty("--dcc-s", d.discSize); root.style.setProperty("--dcc-sheen", "" + d.sheen); root.style.setProperty("--dcc-spin", d.spin + "s");
    root.setAttribute("role", "region"); root.setAttribute("aria-roledescription", "carousel"); root.setAttribute("aria-label", d.ariaLabel); root.tabIndex = 0;
    if (d.spin > 0) root.setAttribute("data-spin", "");

    var html = "";
    if (d.frame) html += '<div class="dcc-frame" aria-hidden="true"></div>';
    if (d.brand || d.nav.length || (d.indexLabel && n > 1)) {
      html += '<nav class="dcc-nav" data-dcc-ui aria-label="' + esc(d.ariaLabel) + ' menu">';
      if (d.brand) html += '<span class="dcc-brand">' + esc(d.brand) + "</span>";
      d.nav.forEach(function (l, k) {
        html += l.href ? '<a class="dcc-link" href="' + esc(l.href) + '"' + (k === d.navActive ? ' aria-current="page"' : "") + ">" + esc(l.label) + "</a>"
          : '<span class="dcc-link"' + (k === d.navActive ? ' aria-current="true"' : "") + ">" + esc(l.label) + "</span>";
      });
      if (d.indexLabel && n > 1) html += '<div class="dcc-menu" data-dcc-menu><button type="button" class="dcc-menubtn" aria-haspopup="true" aria-expanded="false" aria-controls="' + uid + 'list">' + esc(d.indexLabel) + " " + CARET + "</button></div>";
      html += "</nav>";
    }
    html += '<div class="dcc-head" aria-hidden="true"></div><div class="dcc-stage"></div><div class="dcc-revs" aria-hidden="true"></div>';
    if (d.hint) html += '<div class="dcc-hint" aria-hidden="true">' + esc(d.hint) + "</div>";
    if (d.controls && n > 1) html += '<div class="dcc-ctl" data-dcc-ui><button type="button" class="dcc-btn" data-dir="-1" aria-label="Previous ' + esc(d.itemNoun) + '">' + ARROW_L + '</button><span class="dcc-count" aria-hidden="true"></span><button type="button" class="dcc-btn" data-dir="1" aria-label="Next ' + esc(d.itemNoun) + '">' + ARROW_R + "</button></div>";
    html += '<div class="dcc-sr" aria-live="polite" aria-atomic="true"></div>';
    root.innerHTML = html;

    var stage = root.querySelector(".dcc-stage"), headEl = root.querySelector(".dcc-head"), revsEl = root.querySelector(".dcc-revs");
    var srEl = root.querySelector(".dcc-sr"), countEl = root.querySelector(".dcc-count"), menuWrap = root.querySelector(".dcc-menu");
    var menuBtn = menuWrap && menuWrap.querySelector(".dcc-menubtn"), listEl = null;
    var prevBtn = root.querySelector('.dcc-btn[data-dir="-1"]'), nextBtn = root.querySelector('.dcc-btn[data-dir="1"]');

    var slides = items.map(function (item, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "dcc-slide";
      b.setAttribute("aria-roledescription", "slide"); b.setAttribute("aria-label", (i + 1) + " of " + n + ": " + item.title);
      b.innerHTML = '<span class="dcc-tilt">' + discFace(item, i, { uid: uid, display: d.display, brand: d.brand }) + "</span>";
      if (Math.abs(i - start) > 3) { var im = b.querySelector("img"); if (im) im.loading = "lazy"; }
      b.addEventListener("click", function () {
        if (E.clickBlock) return;
        st.stopped = true;
        if (i === st.active) { if (d.onSelect) d.onSelect(items[i], i); }
        else goTo(i);
      });
      stage.appendChild(b);
      return b;
    });

    function cfg() { return { n: n, loop: d.loop, spacing: d.spacing, rise: d.rise, depth: d.depth, yaw: d.yaw, fan: d.fan, tilt: d.tilt, roll: d.roll, bounce: d.bounce, duration: d.duration }; }
    var C = cfg();
    function styleFor(i, a, b) {
      var p = poseOf(offsetOf(i, a, C.n, C.loop), offsetOf(i, b, C.n, C.loop), C);
      return {
        transform: "translate3d(calc(" + p.x.toFixed(4) + " * var(--dcc-s)), calc(" + p.y.toFixed(4) + " * var(--dcc-s)), calc(" + p.z.toFixed(4) + " * var(--dcc-s))) rotateZ(" + C.tilt + "deg) rotateY(" + p.yaw.toFixed(3) + "deg) rotateX(8deg)",
        roll: p.roll.toFixed(2) + "deg", glint: (p.yaw * 3 + p.x * 40).toFixed(1) + "deg", zIndex: p.zIndex, opacity: p.opacity, hidden: p.hidden || p.opacity <= 0
      };
    }
    function paint() {
      for (var i = 0; i < slides.length; i++) {
        var el = slides[i], t = styleFor(i, E.a, E.b);
        el.style.transform = t.transform; el.style.zIndex = "" + t.zIndex;
        el.style.opacity = t.opacity < 1 ? t.opacity.toFixed(3) : "";
        el.style.visibility = t.hidden ? "hidden" : "";
        el.style.setProperty("--dcc-roll", t.roll); el.style.setProperty("--dcc-glint", t.glint);
      }
    }
    function frame(now) {
      var dt = Math.min((now - (E.last || now)) / 1000, 1 / 20);
      E.last = now;
      var s = springOf(C.bounce, C.duration), r;
      if (E.reduced && !E.drag) { E.a = E.b = E.target; E.va = E.vb = 0; }
      else {
        if (!E.drag) { r = springStep(E.a, E.va, E.target, s.omega, s.slide, dt); E.a = r[0]; E.va = r[1]; }
        r = springStep(E.b, E.vb, E.a, s.omega * 1.05, s.tilt, dt); E.b = r[0]; E.vb = r[1];
      }
      paint();
      var settled = !E.drag && Math.abs(E.a - E.target) < 1e-3 && Math.abs(E.va) < 1e-2 && Math.abs(E.b - E.a) < 1e-3 && Math.abs(E.vb) < 1e-2;
      if (settled) { E.a = E.b = E.target; E.va = E.vb = 0; paint(); E.raf = 0; E.last = 0; return; }
      E.raf = requestAnimationFrame(frame);
    }
    function kick() { if (!E.raf) E.raf = requestAnimationFrame(frame); }

    function renderActive() {
      var i = st.active, cur = items[i];
      slides.forEach(function (b, k) {
        if (k === i) { b.setAttribute("data-active", ""); b.setAttribute("aria-current", "true"); b.tabIndex = 0; }
        else { b.removeAttribute("data-active"); b.removeAttribute("aria-current"); b.tabIndex = -1; }
      });
      if (d.details && cur) {
        var h = '<h2 class="dcc-title dcc-in" style="font-family:' + esc(d.serif) + '">' + esc(cur.title) + "</h2>";
        if (cur.credits && cur.credits.length) {
          h += '<dl class="dcc-dl">' + cur.credits.map(function (c, k) {
            return '<div class="dcc-row dcc-in" style="--i:' + (k + 1) + '"><dt>' + esc(c.label) + "</dt><dd>" + lines(c.value).map(function (v) { return "<span>" + esc(v) + "</span>"; }).join("") + "</dd></div>";
          }).join("") + "</dl>";
        }
        headEl.innerHTML = h;
      }
      if (d.reviews) {
        var qs = (cur && cur.reviews || []).slice(0, 2);
        revsEl.innerHTML = qs.map(function (q, k) {
          var stars = Math.max(0, Math.min(5, Math.round(q.stars == null ? 5 : q.stars)));
          return '<figure class="dcc-rev dcc-in" style="--i:' + (k + 3) + '"><div class="dcc-stars">' + "★".repeat(stars) + "☆".repeat(5 - stars) + '</div><figcaption class="dcc-src">' + esc(q.source) + '</figcaption><blockquote class="dcc-quote" style="font-family:' + esc(d.serif) + '">“' + esc(q.quote) + "”</blockquote></figure>";
        }).join("");
      }
      if (countEl) countEl.innerHTML = "<b>" + pad(i + 1) + "</b> / " + pad(n);
      if (prevBtn) prevBtn.disabled = !d.loop && i <= 0;
      if (nextBtn) nextBtn.disabled = !d.loop && i >= n - 1;
      var year = cur && cur.credits && cur.credits.filter(function (c) { return /year/i.test(c.label); })[0];
      srEl.textContent = cur ? d.itemNoun.charAt(0).toUpperCase() + d.itemNoun.slice(1) + " " + (i + 1) + " of " + n + ": " + cur.title + (year ? ", " + lines(year.value)[0] : "") : "";
      if (listEl) listEl.querySelectorAll(".dcc-opt").forEach(function (b, k) { if (k === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      schedule();
    }
    function setActive(i) { if (i === st.active) return; st.active = i; renderActive(); if (d.onIndexChange) d.onIndexChange(i); }
    function setTarget(t) {
      if (!n) return;
      E.target = d.loop ? t : Math.min(Math.max(t, 0), n - 1);
      setActive(indexAt(E.target, n, d.loop));
      kick();
    }
    function goTo(i) { setTarget(targetFor(i, E.target, n, d.loop)); }
    function step(by) { setTarget(Math.round(E.target) + by); }
    this.goTo = goTo; this.step = step; this.items = items;
    this.stop = function () { st.stopped = true; schedule(); };
    this.play = function (ms) { if (ms != null) d.autoplay = ms; st.stopped = false; schedule(); };
    this.slides = slides; this.stage = stage;
    this.active = function () { return st.active; };

    // menu
    function setMenu(open) {
      st.menu = open;
      if (!menuBtn) return;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && !listEl) {
        listEl = document.createElement("ul");
        listEl.className = "dcc-list"; listEl.id = uid + "list"; listEl.style.fontFamily = d.sans;
        listEl.innerHTML = items.map(function (it, k) {
          var y = it.credits && it.credits.filter(function (c) { return /year/i.test(c.label); })[0];
          return '<li><button type="button" class="dcc-opt" data-k="' + k + '"' + (k === st.active ? ' aria-current="true"' : "") + '><span class="dcc-optn">' + pad(k + 1) + '</span><span class="dcc-optt">' + esc(it.title) + "</span>" + (y ? '<span class="dcc-opty">' + esc(lines(y.value)[0]) + "</span>" : "") + "</button></li>";
        }).join("");
        listEl.addEventListener("click", function (e) {
          var b = e.target.closest(".dcc-opt"); if (!b) return;
          st.stopped = true; setMenu(false); goTo(+b.getAttribute("data-k"));
        });
        menuWrap.appendChild(listEl);
      } else if (!open && listEl) { listEl.remove(); listEl = null; }
      schedule();
    }
    if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(!st.menu); });
    document.addEventListener("pointerdown", function (e) { if (st.menu && menuWrap && !menuWrap.contains(e.target)) setMenu(false); });
    [prevBtn, nextBtn].forEach(function (b) { if (b) b.addEventListener("click", function () { st.stopped = true; step(+b.getAttribute("data-dir")); }); });

    // pointer
    root.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || !n) return;
      if (e.target.closest("[data-dcc-ui]")) return;
      E.drag = { id: e.pointerId, x0: e.clientX, pos0: E.a, moved: false, samples: [{ t: e.timeStamp, x: e.clientX }] };
    });
    root.addEventListener("pointermove", function (e) {
      if (e.pointerType === "mouse" && !(E.drag && E.drag.moved)) {
        var r = stage.getBoundingClientRect();
        var cx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / r.width));
        var cy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / r.height));
        root.style.setProperty("--dcc-px", cx.toFixed(3)); root.style.setProperty("--dcc-py", cy.toFixed(3));
      }
      var g = E.drag;
      if (!g || g.id !== e.pointerId) return;
      var dx = e.clientX - g.x0;
      if (!g.moved) {
        if (Math.abs(dx) < 6) return;
        g.moved = true; g.x0 = e.clientX; g.pos0 = E.a; E.va = 0;
        try { root.setPointerCapture(e.pointerId); } catch (err) {}
        st.dragging = true; st.stopped = true; root.setAttribute("data-dragging", ""); schedule();
      }
      var raw = g.pos0 - (e.clientX - g.x0) / (E.size * d.spacing);
      E.a = d.loop ? raw : rubber(raw, n);
      g.samples.push({ t: e.timeStamp, x: e.clientX }); if (g.samples.length > 6) g.samples.shift();
      setActive(indexAt(E.a, n, d.loop));
      kick();
    });
    function up(e) {
      var g = E.drag;
      if (!g || g.id !== e.pointerId) return;
      E.drag = null;
      if (!g.moved) return;
      st.dragging = false; root.removeAttribute("data-dragging");
      E.clickBlock = true; setTimeout(function () { E.clickBlock = false; }, 0);
      var first = g.samples[0], last = g.samples[g.samples.length - 1], ms = Math.max(last.t - first.t, 1);
      var v = e.type === "pointercancel" ? 0 : (-(last.x - first.x) / ms / (E.size * d.spacing)) * 1000;
      E.va = v;
      setTarget(releaseTarget(E.a, v, n, d.loop));
    }
    root.addEventListener("pointerup", up); root.addEventListener("pointercancel", up);
    root.addEventListener("pointerleave", function () { root.style.setProperty("--dcc-px", "0"); root.style.setProperty("--dcc-py", "0"); });
    root.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      var now = performance.now();
      if (now - E.wheelAt > 160) E.wheel = 0;
      E.wheelAt = now; E.wheel += e.deltaX;
      if (Math.abs(E.wheel) > 50 && now - E.stepAt > 320) { st.stopped = true; step(Math.sign(E.wheel)); E.wheel = 0; E.stepAt = now; }
    }, { passive: false });
    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && st.menu) { setMenu(false); menuBtn.focus(); return; }
      if (e.target.closest("[data-dcc-menu]")) return;
      var handled = true;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(n - 1);
      else handled = false;
      if (handled) { e.preventDefault(); st.stopped = true; }
    });
    root.addEventListener("focusin", function () { st.focused = true; schedule(); });
    root.addEventListener("focusout", function (e) { if (!root.contains(e.relatedTarget)) { st.focused = false; schedule(); } });

    // size, reduced motion, visibility
    function measure() { E.size = stage.offsetWidth || 300; }
    measure();
    if ("ResizeObserver" in window) new ResizeObserver(measure).observe(stage);
    reducedMQ.addEventListener && reducedMQ.addEventListener("change", function () { E.reduced = reducedMQ.matches; });
    if (d.autoplay && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { st.visible = en[0].isIntersecting && !document.hidden; schedule(); }).observe(root);
      document.addEventListener("visibilitychange", function () { st.visible = !document.hidden; schedule(); });
    }
    var timer = 0;
    function schedule() {
      clearTimeout(timer);
      var playing = d.autoplay > 0 && n > 1 && !st.stopped && !st.focused && !st.dragging && !st.menu && st.visible && !E.reduced;
      if (!playing) return;
      timer = setTimeout(function () {
        if (!d.loop && Math.round(E.target) >= n - 1) goTo(0); else step(1);
      }, d.autoplay);
    }
    this.destroy = function () { cancelAnimationFrame(E.raf); clearTimeout(timer); root.innerHTML = ""; };
    paint(); renderActive();
  }
  DiscCascade.discFace = discFace;
  DiscCascade.inkFor = inkFor;
  window.DiscCascade = DiscCascade;
})();

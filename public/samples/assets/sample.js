/* Shared plumbing for the Zenith Dubai CV concept sites (public/samples/*.html).
   Load in <head> without defer, before the page's own script.

   Each site writes its own choreography. This file only provides what every site needs:
   - window.ZC = { reduce, embedded, still, motion, toast, smooth(), visible(), ready() }
       reduce   – the visitor asked for reduced motion
       embedded – the page is shown inside the Zenith gallery viewer (iframe)
       still    – ?static in the URL (used for preview captures): render final states, no animation
       motion   – !reduce && !still
   - ZC.smooth(): Lenis smooth scrolling synced with GSAP ScrollTrigger (only when motion is on),
     plus smooth in-page anchor links. Returns the Lenis instance or null.
   - ZC.visible(el, onChange): calls onChange(true|false) as el enters/leaves the viewport
     (used to pause canvases and WebGL off-screen).
   - The "Concept site" badge (hidden inside the gallery viewer).
   - [data-demo] links show a short notice instead of going nowhere.
   - a[data-spy] links get aria-current while their section is on screen. */
(function () {
  "use strict";
  var root = document.documentElement;
  var embedded = false;
  try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var still = /[?&]static\b/.test(location.search);
  var motion = !reduce && !still;
  if (embedded) root.classList.add("is-embedded");
  if (still) root.classList.add("zc-static");
  if (reduce) root.classList.add("zc-reduce");
  root.classList.add(motion ? "zc-motion" : "zc-still");

  var css =
    "html.lenis,html.lenis body{height:auto}.lenis-smooth{scroll-behavior:auto!important}" +
    ".lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis-stopped{overflow:clip}" +
    ".zc-badge{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:9px 15px 9px 12px;border-radius:999px;background:var(--zc-bg,#121212);color:var(--zc-fg,#fff);font:600 11px/1.2 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;letter-spacing:.05em;text-decoration:none;box-shadow:0 12px 30px -14px rgba(0,0,0,.6);transition:transform .25s ease}" +
    ".zc-badge:hover{transform:translateY(-2px)}" +
    ".zc-badge i{width:7px;height:7px;border-radius:50%;background:var(--zc-dot,#C8A96E);flex:none}" +
    ".zc-badge:focus-visible,.zc-toast:focus-visible{outline:2px solid var(--zc-dot,#C8A96E);outline-offset:3px}" +
    ".is-embedded .zc-badge{display:none}" +
    ".zc-toast{position:fixed;left:50%;bottom:max(22px,env(safe-area-inset-bottom,0px));z-index:2147483001;max-width:min(92vw,420px);transform:translate(-50%,16px);opacity:0;pointer-events:none;padding:12px 18px;border-radius:12px;background:var(--zc-bg,#121212);color:var(--zc-fg,#fff);font:500 13px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;text-align:center;box-shadow:0 18px 40px -16px rgba(0,0,0,.6);transition:opacity .25s ease,transform .25s ease}" +
    ".zc-toast.on{opacity:1;transform:translate(-50%,0)}" +
    ".zc-skip{position:fixed;left:12px;top:12px;z-index:2147483002;padding:10px 14px;border-radius:8px;background:#111;color:#fff;font:600 13px/1 system-ui,sans-serif;transform:translateY(-160%);transition:transform .2s}" +
    ".zc-skip:focus{transform:none;outline:2px solid #fff;outline-offset:2px}" +
    "@media (prefers-reduced-motion:reduce){.zc-badge,.zc-toast,.zc-skip{transition:none}}";
  var style = document.createElement("style");
  style.textContent = css;
  (document.head || root).appendChild(style);

  var toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "zc-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("on"); }, 2800);
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  var lenis = null;
  function smooth(opts) {
    if (lenis) return lenis;
    var hasGsap = window.gsap && window.ScrollTrigger;
    if (motion && window.Lenis) {
      lenis = new window.Lenis(Object.assign({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true, anchors: false }, opts || {}));
      if (hasGsap) {
        lenis.on("scroll", window.ScrollTrigger.update);
        window.gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        window.gsap.ticker.lagSmoothing(0);
      } else {
        var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    }
    // In-page anchors: smooth with Lenis when available, native otherwise; move focus for keyboard users.
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a || a.hasAttribute("data-demo")) return;
      var id = a.getAttribute("href").slice(1);
      var t = id ? document.getElementById(id) : null;
      if (!t) return;
      e.preventDefault();
      var off = parseFloat(a.getAttribute("data-offset") || "0");
      if (lenis) lenis.scrollTo(t, { offset: off, duration: 1.4 });
      else window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY + off, behavior: motion ? "smooth" : "auto" });
      if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "-1");
      t.focus({ preventScroll: true });
      history.replaceState(null, "", "#" + id);
    });
    return lenis;
  }

  function visible(el, onChange, margin) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) { onChange(true); return; }
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { onChange(en.isIntersecting); });
    }, { rootMargin: margin || "120px 0px" }).observe(el);
  }

  window.ZC = { reduce: reduce, embedded: embedded, still: still, motion: motion, toast: toast, smooth: smooth, visible: visible, ready: ready };

  ready(function () {
    var main = document.querySelector("main");
    if (main) {
      if (!main.id) main.id = "main";
      var skip = document.createElement("a");
      skip.className = "zc-skip";
      skip.href = "#" + main.id;
      skip.textContent = "Skip to content";
      document.body.insertBefore(skip, document.body.firstChild);
    }

    if (!embedded) {
      var badge = document.createElement("a");
      badge.className = "zc-badge";
      badge.href = "https://zenithdubaicv.com/#websites";
      badge.target = "_blank";
      badge.rel = "noopener";
      badge.innerHTML = "<i aria-hidden=\"true\"></i>Concept site · Zenith Dubai CV";
      document.body.appendChild(badge);
    }

    document.addEventListener("click", function (e) {
      var el = e.target && e.target.closest ? e.target.closest("[data-demo]") : null;
      if (!el) return;
      e.preventDefault();
      toast(el.getAttribute("data-demo") || "This is a concept site, so contact links are switched off.");
    });

    var spies = Array.prototype.slice.call(document.querySelectorAll("a[data-spy]"));
    if (spies.length && "IntersectionObserver" in window) {
      var byId = {};
      spies.forEach(function (a) {
        var id = (a.getAttribute("href") || "").slice(1);
        if (!id) return;
        (byId[id] = byId[id] || []).push(a);
      });
      var current = null;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || en.target.id === current) return;
          current = en.target.id;
          spies.forEach(function (a) { a.removeAttribute("aria-current"); });
          (byId[current] || []).forEach(function (a) { a.setAttribute("aria-current", "location"); });
          root.setAttribute("data-section", current);
          document.dispatchEvent(new CustomEvent("zc:section", { detail: current }));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(byId).forEach(function (id) {
        var t = document.getElementById(id);
        if (t) io.observe(t);
      });
    }
  });
})();

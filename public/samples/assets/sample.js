/* Shared behaviour for the Zenith Dubai CV concept sites (public/samples/*.html).
   Load in <head> without defer so the reveal state is set before first paint.

   - Adds the "Concept site" badge, unless the page is shown inside the gallery viewer.
   - Links marked [data-demo] show a short notice instead of going nowhere.
   - a[data-spy] links get aria-current while their section is on screen
     (also exposed as <html data-section="id"> and a "zc:section" event).
   - [data-reveal] elements fade in on scroll. Skipped with reduced motion,
     without IntersectionObserver, or with ?static (used for preview captures).
   - Pages read window.ZC = { reduce, embedded, still, toast } for their own motion. */
(function () {
  "use strict";
  var root = document.documentElement;
  var embedded = false;
  try { embedded = window.self !== window.top; } catch (e) { embedded = true; }
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var still = /[?&]static\b/.test(location.search);
  if (embedded) root.classList.add("is-embedded");
  if (still) root.classList.add("zc-static");
  if (reduce) root.classList.add("zc-reduce");
  var reveal = !reduce && !still && "IntersectionObserver" in window;
  if (reveal) root.classList.add("zc-reveal");

  var css =
    ".zc-reveal [data-reveal]{opacity:0;transform:translate3d(0,18px,0);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1);transition-delay:var(--d,0s)}" +
    ".zc-reveal [data-reveal].is-in{opacity:1;transform:none}" +
    ".zc-badge{position:fixed;right:max(14px,env(safe-area-inset-right,0px));bottom:max(14px,env(safe-area-inset-bottom,0px));z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:9px 15px 9px 12px;border-radius:999px;background:var(--zc-bg,#121212);color:var(--zc-fg,#fff);font:600 11px/1.2 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;letter-spacing:.05em;text-decoration:none;box-shadow:0 12px 30px -14px rgba(0,0,0,.6);transition:transform .25s ease}" +
    ".zc-badge:hover{transform:translateY(-2px)}" +
    ".zc-badge i{width:7px;height:7px;border-radius:50%;background:var(--zc-dot,#C8A96E);flex:none}" +
    ".zc-badge:focus-visible,.zc-toast:focus-visible{outline:2px solid var(--zc-dot,#C8A96E);outline-offset:3px}" +
    ".is-embedded .zc-badge{display:none}" +
    ".zc-toast{position:fixed;left:50%;bottom:max(22px,env(safe-area-inset-bottom,0px));z-index:2147483001;max-width:min(92vw,420px);transform:translate(-50%,16px);opacity:0;pointer-events:none;padding:12px 18px;border-radius:12px;background:var(--zc-bg,#121212);color:var(--zc-fg,#fff);font:500 13px/1.45 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;text-align:center;box-shadow:0 18px 40px -16px rgba(0,0,0,.6);transition:opacity .25s ease,transform .25s ease}" +
    ".zc-toast.on{opacity:1;transform:translate(-50%,0)}" +
    "@media (prefers-reduced-motion:reduce){.zc-badge,.zc-toast{transition:none}}";
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
    toastTimer = setTimeout(function () { toastEl.classList.remove("on"); }, 2600);
  }

  window.ZC = { reduce: reduce, embedded: embedded, still: still, toast: toast };

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
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

    if (reveal) {
      var items = document.querySelectorAll("[data-reveal]");
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); ro.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
      Array.prototype.forEach.call(items, function (el) { ro.observe(el); });
    }
  });
})();

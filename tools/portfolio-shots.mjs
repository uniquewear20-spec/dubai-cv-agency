// Captures the two live portfolio websites (desktop, gallery frame, phone) and their framing headers.
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(process.env.NODE_PATH + "/");
const { chromium } = require("playwright");
const sites = {
  "abdell-el-khayir": "https://abdell-portfolio.netlify.app/",
  "wasim-akram": "https://wasim-akram-portfolio.netlify.app/",
};
const out = process.env.OUT;
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch();
const meta = {};
for (const [slug, url] of Object.entries(sites)) {
  const res = await fetch(url);
  meta[slug] = { url, status: res.status, xFrameOptions: res.headers.get("x-frame-options"), csp: res.headers.get("content-security-policy"), server: res.headers.get("server") };
  for (const [name, w, h, mobile, full] of [["gallery", 1200, 1043, false, false], ["desk", 1440, 900, false, true], ["mob", 390, 844, true, true], ["tab", 820, 1180, true, false]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
    } catch (e) { meta[slug][name + "Error"] = String(e).slice(0, 200); }
    await sleep(5000);
    if (full) {
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await sleep(250); }
      await page.evaluate(() => window.scrollTo(0, 0)); await sleep(1500);
    }
    meta[slug][name + "Size"] = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.scrollHeight]);
    await page.screenshot({ path: `${out}/${slug}-${name}.jpg`, type: "jpeg", quality: 85, fullPage: full });
    await ctx.close();
  }
}
fs.writeFileSync(`${out}/headers.json`, JSON.stringify(meta, null, 2));
await browser.close();
console.log(JSON.stringify(meta, null, 2));

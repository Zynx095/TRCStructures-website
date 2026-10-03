// usage: node shot.mjs '<json>'  where json = { base, shots:[{path, out, w, h, full, scrolls:[y...], wait, reduce, dpr, click, actions}] }
import puppeteer from "puppeteer-core";
const cfg = JSON.parse(process.argv[2]);
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
  args: ["--hide-scrollbars", "--enable-webgl", "--ignore-gpu-blocklist", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const logs = [];
for (const s of cfg.shots) {
  const page = await browser.newPage();
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) logs.push(`[${s.out}] ${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on("pageerror", (e) => logs.push(`[${s.out}] pageerror: ${String(e).slice(0, 300)}`));
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: s.dpr ?? 1, isMobile: !!s.mobile, hasTouch: !!s.mobile });
  if (s.reduce) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.goto(cfg.base + s.path, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((r) => setTimeout(r, s.wait ?? 1500));
  if (s.actions) {
    for (const a of s.actions) {
      if (a.click) await page.click(a.click);
      if (a.hover) await page.hover(a.hover);
      if (a.eval) await page.evaluate(a.eval);
      if (a.type) await page.type(a.type[0], a.type[1]);
      await new Promise((r) => setTimeout(r, a.wait ?? 600));
    }
  }
  const scrolls = s.scrolls ?? [null];
  for (let i = 0; i < scrolls.length; i++) {
    const y = scrolls[i];
    if (y !== null) {
      // scroll in steps so ScrollTrigger sees intermediate positions
      await page.evaluate(async (target) => {
        const t = typeof target === "string" ? (document.querySelector(target)?.getBoundingClientRect().top ?? 0) + window.scrollY : target;
        const start = window.scrollY; const steps = 12;
        for (let k = 1; k <= steps; k++) { window.scrollTo(0, start + ((t - start) * k) / steps); await new Promise((r) => setTimeout(r, 40)); }
      }, y);
      await new Promise((r) => setTimeout(r, s.settle ?? 1200));
    }
    const out = scrolls.length > 1 ? s.out.replace(".png", `-${i}.png`) : s.out;
    await page.screenshot({ path: out, fullPage: !!s.full, captureBeyondViewport: !!s.full });
  }
  if (s.metrics) {
    const m = await page.evaluate(() => ({
      docW: document.documentElement.scrollWidth, winW: window.innerWidth, docH: document.documentElement.scrollHeight,
      overflowers: [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.right > window.innerWidth + 1 && getComputedStyle(e).position !== "fixed"; }).slice(0, 8).map((e) => e.tagName + "." + (e.className?.toString?.() || "").slice(0, 60)),
    }));
    logs.push(`[${s.out}] metrics ${JSON.stringify(m)}`);
  }
  await page.close();
}
await browser.close();
console.log(logs.join("\n") || "no console errors");

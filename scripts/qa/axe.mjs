import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3100";
const paths = (process.argv[3] ?? "/,/projects,/projects/hal-staff-villas,/projects/sb-properties-hindupur-sump-oht,/services,/services/sump-oht-construction,/about,/contact,/privacy,/nope").split(",");
const axeSrc = readFileSync(new URL("../../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844, isMobile: true, hasTouch: true }]) {
  for (const p of paths) {
    const page = await browser.newPage();
    await page.setViewport(vp);
    await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.goto(base + p, { waitUntil: "networkidle2", timeout: 120000 });
    await new Promise((r) => setTimeout(r, 1500));
    await page.evaluate(axeSrc);
    const res = await page.evaluate(async () => {
      const r = await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
      return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.slice(0, 4).map((n) => n.target.join(" ") + " :: " + (n.failureSummary || "").split("\n").slice(1, 2).join(" ")) , count: v.nodes.length }));
    });
    console.log(`\n== ${vp.width} ${p} :: ${res.length} violation types`);
    for (const v of res) console.log(` - [${v.impact}] ${v.id} (${v.count}): ${v.help}\n     ${v.nodes.join("\n     ")}`);
    await page.close();
  }
}
await browser.close();

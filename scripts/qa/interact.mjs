import puppeteer from "puppeteer-core";
const base = process.argv[2] ?? "http://localhost:3100";
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(...a);
const errors = [];

// 1. mobile menu
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push("menu: " + e));
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(base + "/", { waitUntil: "networkidle2" });
  await sleep(1500);
  await page.click('button[aria-controls="mobile-menu"]');
  await sleep(1200);
  const st = await page.evaluate(() => ({
    expanded: document.querySelector('button[aria-controls="mobile-menu"]').getAttribute("aria-expanded"),
    vis: getComputedStyle(document.getElementById("mobile-menu")).visibility,
    focus: document.activeElement?.textContent?.trim().slice(0, 20),
    htmlLock: document.documentElement.classList.contains("menu-open"),
  }));
  log("menu open:", st);
  await page.screenshot({ path: "i-menu.png" });
  await page.keyboard.press("Escape");
  await sleep(900);
  const st2 = await page.evaluate(() => ({
    vis: getComputedStyle(document.getElementById("mobile-menu")).visibility,
    focus: document.activeElement?.getAttribute("aria-label"),
    htmlLock: document.documentElement.classList.contains("menu-open"),
  }));
  log("menu closed:", st2);
  await page.close();
}

// 2. services tabs keyboard
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push("tabs: " + e));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base + "/", { waitUntil: "networkidle2" });
  await sleep(1500);
  await page.focus('[role="tab"][aria-selected="true"]');
  await page.keyboard.press("ArrowDown");
  await sleep(1200);
  const sel = await page.evaluate(() => [...document.querySelectorAll('[role="tab"]')].map((t) => t.getAttribute("aria-selected")).join(","));
  const focus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  log("tabs after ArrowDown:", sel, "| focus:", focus);
  await page.evaluate(() => document.querySelector('[role="tablist"]').scrollIntoView({ block: "start" }));
  await sleep(1200);
  await page.screenshot({ path: "i-tabs.png" });
  await page.close();
}

// 3. project filters + register view
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push("filters: " + e));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base + "/projects", { waitUntil: "networkidle2" });
  await sleep(1500);
  const btns = await page.$$('[aria-label="Filter by status"] button');
  await btns[2].click();
  await sleep(1400);
  const showing = await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.textContent);
  const visible = await page.evaluate(() => [...document.querySelectorAll("[data-flip]")].filter((e) => !e.hidden).length);
  log("completed filter:", showing, "visible cards:", visible);
  const types = await page.$$('[aria-label="Filter by type"] button');
  await types[types.length - 1].click();
  await sleep(1400);
  log("+water filter:", await page.evaluate(() => document.querySelector('[aria-live="polite"]')?.textContent));
  await page.evaluate(() => window.scrollTo(0, 700));
  await sleep(600);
  await page.screenshot({ path: "i-filter.png" });
  await page.click('button[aria-label="Register view"]');
  await sleep(800);
  await page.evaluate(() => window.scrollTo(0, 600));
  await sleep(500);
  await page.screenshot({ path: "i-register.png" });
  await page.close();
}

// 4. enquiry form
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push("form: " + e));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base + "/contact", { waitUntil: "networkidle2" });
  await sleep(1500);
  await page.click('form button[type="submit"]');
  await sleep(500);
  const errs = await page.evaluate(() => ({
    invalid: [...document.querySelectorAll('[aria-invalid="true"]')].map((e) => e.getAttribute("name")),
    focus: document.activeElement?.getAttribute("name"),
  }));
  log("empty submit:", errs);
  await sleep(3000);
  await page.type('input[name="name"]', "Test Person");
  await page.type('input[name="phone"]', "+91 98765 43210");
  await page.select('select[name="projectType"]', "Sump or overhead tank");
  await page.type('input[name="location"]', "Devanahalli");
  await page.type('textarea[name="message"]', "Testing the enquiry form end to end.");
  await page.click('form button[type="submit"]');
  await sleep(2500);
  const done = await page.evaluate(() => document.querySelector('[role="status"]')?.textContent?.slice(0, 80) ?? document.querySelector('[role="alert"]')?.textContent?.slice(0, 120));
  log("valid submit:", done);
  await page.screenshot({ path: "i-form.png" });
  await page.close();
}

// 5. lightbox
{
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push("lightbox: " + e));
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base + "/projects/hal-staff-villas", { waitUntil: "networkidle2" });
  await sleep(1500);
  await page.evaluate(() => document.querySelector("[data-plate]").scrollIntoView({ block: "center" }));
  await sleep(1500);
  await page.click("[data-plate]");
  await sleep(1200);
  const open = await page.evaluate(() => ({ open: document.querySelector("dialog")?.open, focus: document.activeElement?.getAttribute("aria-label") }));
  log("lightbox:", open);
  await page.keyboard.press("ArrowRight");
  await sleep(800);
  await page.screenshot({ path: "i-lightbox.png" });
  await page.keyboard.press("Escape");
  await sleep(500);
  log("lightbox closed:", await page.evaluate(() => ({ open: document.querySelector("dialog")?.open, focus: document.activeElement?.getAttribute("aria-label")?.slice(0, 40) })));
  await page.close();
}
await browser.close();
log("errors:", errors.length ? errors : "none");

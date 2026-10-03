# Visual / accessibility QA scripts

Browser-driven checks used during the build. They are **not** project dependencies; install the tools
temporarily when you need them:

```bash
npm i --no-save puppeteer-core axe-core
# Chrome or Edge path (defaults to Edge on Windows)
export CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe"
npm run dev   # or: npm run build && npm run start
```

| Script | What it does |
|---|---|
| `node scripts/qa/shot.mjs '<json>'` | Screenshots at any viewport, with stepped scrolling so ScrollTrigger scenes render. Example: `node scripts/qa/shot.mjs '{"base":"http://localhost:3000","shots":[{"path":"/","out":"home.png","w":390,"h":844,"mobile":true,"scrolls":[0,900,1800]}]}'` (`"metrics":true` also reports horizontal overflow). |
| `node scripts/qa/axe.mjs http://localhost:3000` | axe-core WCAG 2.2 AA scan of the main pages at desktop and phone widths. |
| `node scripts/qa/interact.mjs http://localhost:3000` | Keyboard/interaction smoke test: mobile menu, service tabs, project filters, enquiry form, photo viewer. |

Lighthouse: `CHROME_PATH=… npx lighthouse http://localhost:3000 --preset=desktop` (and without `--preset` for mobile).

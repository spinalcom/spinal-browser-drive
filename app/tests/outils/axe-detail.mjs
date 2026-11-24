// Copyright 2026 SpinalCom - www.spinalcom.com
// Outil de diagnostic : affiche le HTML des nœuds en violation pour une règle axe. Usage : node tests/outils/axe-detail.mjs <url> <règle>
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
const b = await chromium.launch({ headless: true, executablePath: process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell' });
const p = await b.newPage();
await p.goto(process.argv[2], { waitUntil: 'networkidle' });
await p.addScriptTag({ content: readFileSync('node_modules/axe-core/axe.min.js', 'utf8') });
const r = await p.evaluate(async (regle) => (await window.axe.run(document, { runOnly: [regle] })).violations.map(v => v.nodes.map(n => n.html.slice(0, 300))), process.argv[3]);
console.log(JSON.stringify(r, null, 1)); await b.close();

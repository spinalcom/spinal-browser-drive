// Copyright 2026 SpinalCom - www.spinalcom.com
// T3 — design system dans un vrai navigateur (headless) : interactions clés et accessibilité (axe-core).
// Prérequis : `bun run build`. Le test sert lui-même build/ (serveur statique minimal, port libre) ;
// il est ignoré si build/ n'existe pas, pour ne pas bloquer la suite unitaire.
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { chromium, type Browser, type Page } from 'playwright';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { createRequire } from 'node:module';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUILD = fileURLToPath(new URL('../../build', import.meta.url));
const CHROME = process.env.CHROME_PATH ?? `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell`;
const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json', '.svg': 'image/svg+xml' };

/** Sert build/ sous /studio, avec repli SPA sur index.html (comme le serveur web en production). */
function servir(): Promise<{ serveur: Server; url: string }> {
  const serveur = createServer((req, res) => {
    const chemin = decodeURIComponent((req.url ?? '/').split('?')[0]).replace(/^\/studio/, '') || '/';
    let f = normalize(join(BUILD, chemin));
    if (!f.startsWith(BUILD) || !existsSync(f) || statSync(f).isDirectory()) f = join(BUILD, 'index.html');
    res.writeHead(200, { 'content-type': TYPES[extname(f)] ?? 'application/octet-stream' });
    res.end(readFileSync(f));
  });
  return new Promise((ok) => serveur.listen(0, '127.0.0.1', () => {
    const a = serveur.address();
    ok({ serveur, url: `http://127.0.0.1:${typeof a === 'object' && a ? a.port : 0}/studio/_ds` });
  }));
}
const joignable = existsSync(join(BUILD, 'index.html'));
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');

describe.skipIf(!joignable)('design system (navigateur)', () => {
  let b: Browser;
  let p: Page;
  let srv: Server;
  const erreurs: string[] = [];

  beforeAll(async () => {
    const s = await servir();
    srv = s.serveur;
    const URL_DS = s.url;
    b = await chromium.launch({ headless: true, executablePath: CHROME, args: ['--ozone-platform=headless'] });
    p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    p.on('pageerror', (e) => erreurs.push(String(e)));
    p.on('console', (m) => m.type() === 'error' && erreurs.push(m.text()));
    await p.goto(URL_DS, { waitUntil: 'networkidle' });
  });
  afterAll(async () => { await b?.close(); srv?.close(); });

  it('se charge sans erreur', () => expect(erreurs).toEqual([]));

  it('arbre : clavier APG et chargement à la demande', async () => {
    const arbre = p.getByRole('tree', { name: 'Espaces' });
    await arbre.focus();
    await p.keyboard.press('Home');
    await p.keyboard.press('ArrowDown'); // Tour Horizon
    await p.keyboard.press('ArrowDown'); // R+1
    await p.keyboard.press('ArrowLeft'); // ferme R+1
    await expect.poll(() => p.locator('[role=treeitem][aria-level="4"]').count()).toBe(0);
    await p.keyboard.press('ArrowDown'); // R+2 (non chargé)
    await p.keyboard.press('ArrowRight'); // charge (600 ms) puis ouvre
    await expect.poll(() => p.getByRole('treeitem', { name: /Pièce 201/ }).count(), { timeout: 3000 }).toBe(1);
    expect(await p.getByRole('treeitem', { name: /R\+2/ }).getAttribute('aria-expanded')).toBe('true');
  });

  it('arbre : la recherche garde les ancêtres et surligne', async () => {
    await p.getByPlaceholder(/Rechercher dans l'arbre/).fill('bureau');
    await expect.poll(() => p.locator('[role=tree] mark').count()).toBeGreaterThan(0);
    const noms = await p.locator('[role=treeitem]').allInnerTexts();
    expect(noms.every((n) => /bureau|Espaces|Tour Horizon|R\+1/i.test(n))).toBe(true);
    await p.getByPlaceholder(/Rechercher dans l'arbre/).fill('');
  });

  it('tableau : 2 000 lignes mais peu de lignes dans le DOM, tri descendant sur la taille', async () => {
    const grille = p.getByRole('grid', { name: 'Fichiers' });
    const rendues = await grille.locator('[role=row]').count();
    expect(rendues).toBeLessThan(60);
    expect(await grille.getAttribute('aria-rowcount')).toBe('2001');
    await grille.getByRole('button', { name: 'Taille' }).click();
    await grille.getByRole('button', { name: 'Taille' }).click();
    expect(await grille.getByRole('columnheader', { name: /Taille/ }).getAttribute('aria-sort')).toBe('descending');
    const premiere = await grille.locator('[role=row]').nth(1).innerText();
    expect(premiere).toContain('Parking_v0.nwd'); // 1,1 Go, la plus grosse
  });

  it('confirmation de portée : le bouton reprend le verbe et le nombre, jamais « OK »', async () => {
    await p.getByRole('button', { name: 'Supprimer (portée)' }).click();
    const d = p.getByRole('dialog');
    await expect.poll(() => d.isVisible()).toBe(true);
    expect(await d.getByRole('button', { name: 'Supprimer 3 fichiers' }).count()).toBe(1);
    expect(await d.getByRole('button', { name: /^OK$/ }).count()).toBe(0);
    expect(await d.innerText()).toContain('Ce qui ne change pas');
    await p.keyboard.press('Escape');
    await expect.poll(() => p.getByRole('dialog').count()).toBe(0);
  });

  it('palette Ctrl K : filtre et lance une commande', async () => {
    await p.locator('body').click({ position: { x: 5, y: 300 } });
    await p.keyboard.press('Control+k');
    const champ = p.getByPlaceholder('Rechercher un fichier, un objet, une action…').last();
    await expect.poll(() => champ.isVisible()).toBe(true);
    await champ.fill('thème');
    await p.keyboard.press('Enter');
    await expect.poll(() => p.evaluate(() => document.documentElement.dataset.theme)).toBe('dark');
  });

  it('accessibilité : aucune violation sérieuse (axe-core), clair et sombre', async () => {
    for (const theme of ['dark', 'light']) {
      await p.evaluate((t) => (document.documentElement.dataset.theme = t), theme);
      await p.waitForTimeout(400); // transitions de couleur (120 ms) terminées avant de mesurer
      await p.addScriptTag({ content: axe });
      const res = await p.evaluate(async () => {
        // @ts-expect-error axe injecté
        const r = await window.axe.run(document, { resultTypes: ['violations'] });
        return r.violations.filter((v: { impact: string }) => v.impact === 'serious' || v.impact === 'critical')
          .map((v: { id: string; nodes: { target: string[] }[] }) => `${v.id} : ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
      });
      expect(res, `thème ${theme}`).toEqual([]);
    }
  });
});

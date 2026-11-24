// Copyright 2026 SpinalCom - www.spinalcom.com
// Hub jetable pour les tests : binaire spinalhub de la racine, dossier temporaire, ports libres, arrêt par SIGINT.
// Ne touche ni Docker ni nerve-center/memory. Un hub = un dossier `memory` à lui (jamais deux hubs sur le même).
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, rmSync, existsSync, openSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import net from 'node:net';

export const ROOT = resolve(import.meta.dirname, '../../../../..'); // racine spinalcore
const BIN = join(ROOT, 'nerve-center/spinalhub');
export const ADMIN_PW = 'TestAdmin-0001';

function portLibre() {
  return new Promise((ok, ko) => {
    const s = net.createServer().listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => ok(p)); });
    s.on('error', ko);
  });
}

async function attendre(url, ms = 15000) {
  const t = Date.now();
  for (;;) {
    try { const r = await fetch(url); if (r.ok) return await r.text(); } catch {}
    if (Date.now() - t > ms) throw new Error(`hub injoignable : ${url}`);
    await new Promise((r) => setTimeout(r, 100));
  }
}

/** Démarre un hub. `depuis` : dossier memory à copier (instantané de jeu de données), sinon base vierge. */
export async function demarrerHub({ depuis } = {}) {
  if (!existsSync(BIN)) throw new Error(`binaire absent : ${BIN}`);
  const dir = mkdtempSync(join(tmpdir(), 'spinal-test-hub-'));
  mkdirSync(join(dir, 'organs'));
  if (depuis) cpSync(depuis, join(dir, 'memory'), { recursive: true });
  const vierge = !depuis;
  const port = await portLibre(), portBin = await portLibre();
  // dump chaque seconde : le hub n'écrit sa base que sur ce calendrier (pas à l'arrêt), il faut pouvoir geler un jeu
  const args = ['-b', join(dir, 'organs'), '-p', String(port), '-q', String(portBin), '-t', '2', '-d', '* * * * * *', '-g', '0 0 0 1 1 *'];
  if (vierge) args.push('-x', ADMIN_PW, '-w', 'TestRoot-00001', '-r', 'TestRead-00001');
  // sortie dans un fichier : un tube non lu bloque le hub (il attend que sa sortie soit consommée)
  const fichierLog = join(dir, 'hub.log');
  const fd = openSync(fichierLog, 'a');
  const proc = spawn(BIN, args, { cwd: dir, stdio: ['ignore', fd, fd] });
  const lireLog = () => { try { return readFileSync(fichierLog, 'utf8'); } catch { return ''; } };
  let id;
  try { id = await attendre(`http://127.0.0.1:${port}/get_admin_id?u=admin&p=${ADMIN_PW}`); }
  catch (e) { proc.kill('SIGKILL'); throw new Error(`${e.message}\n--- journal du hub ---\n${lireLog().slice(-600)}\nargs: ${args.join(' ')}`); }
  if (!/^\d+/.test(id)) throw new Error(`connexion admin refusée : ${id}\n${lireLog()}`);
  // une base neuve n'est écrite (dump.db) qu'un peu après le démarrage ; arrêtée avant, elle resterait vide
  for (let i = 0; i < 100 && !(existsSync(join(dir, 'memory/dump.db')) && statSync(join(dir, 'memory/dump.db')).size > 0); i++)
    await new Promise((r) => setTimeout(r, 100));
  /** Copie la base après un dump postérieur à l'appel (le hub n'écrit sa base que sur son calendrier). */
  async function geler(dest) {
    // attendre un dump postérieur à la dernière écriture (calendrier : chaque seconde)
        const f = join(dir, 'memory/dump.db');
        const t0 = Date.now();
        while (!(existsSync(f) && statSync(f).mtimeMs > t0 + 50 && statSync(f).size > 0)) {
          if (Date.now() - t0 > 10000) throw new Error(`aucun dump écrit\n${lireLog().slice(-600)}`);
          await new Promise((r) => setTimeout(r, 100));
        }
        await new Promise((r) => setTimeout(r, 300));
        cpSync(join(dir, 'memory'), dest, { recursive: true });
  }
  return {
    dir, port, url: `http://127.0.0.1:${port}`, userId: id.split(' ')[0],
    log: lireLog,
    /** Gel éventuel de la base, puis arrêt par SIGINT, puis suppression du dossier. */
    async arreter({ garderMemoryDans } = {}) {
      if (garderMemoryDans) await geler(garderMemoryDans);
      if (proc.exitCode === null) {
        const fin = new Promise((r) => proc.once('exit', r));
        proc.kill('SIGINT');
        await Promise.race([fin, new Promise((r) => setTimeout(r, 10000))]);
        if (proc.exitCode === null) proc.kill('SIGKILL');
      }
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

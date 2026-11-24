// Copyright 2026 SpinalCom - www.spinalcom.com
// Exécution isolée : un processus Node par exécution, car connectorjs garde un FileSystem global (sondage du
// hub, file d'envoi) qui ne se libère pas. Le parent démarre le hub, l'enfant se connecte, exécute, prend
// l'instantané, le renvoie en JSON, puis le parent arrête le hub.
//
// Usage dans un test : executerIsole({ memoryJeu, module, fonction, args }) où `module` exporte
// `async fonction({ dir, conn, hub, args })`.
import { fork } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { demarrerHub } from './hub.mjs';

const ENFANT = fileURLToPath(new URL('./enfant.mjs', import.meta.url));

export async function dansHub({ memoryJeu, module, fonction, args, instantane = true, cible, garderMemoryDans }) {
  const hub = await demarrerHub({ depuis: memoryJeu });
  try {
    return await new Promise((ok, ko) => {
      const p = fork(ENFANT, [], { stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
      let err = '';
      p.stderr.on('data', (d) => (err += d));
      p.stdout.on('data', () => {});
      const t = setTimeout(() => { p.kill('SIGKILL'); ko(new Error(`délai dépassé\n${err.slice(-2000)}`)); }, 110000);
      p.on('message', (m) => {
        clearTimeout(t);
        p.kill('SIGKILL');
        m.ok ? ok(m) : ko(Object.assign(new Error(m.erreur), { stack: m.pile }));
      });
      p.on('exit', (code) => { clearTimeout(t); ko(new Error(`processus enfant terminé (${code})\n${err.slice(-2000)}`)); });
      p.send({ hub: { port: hub.port, userId: hub.userId }, module: new URL(module, import.meta.url).href, fonction, args, instantane, cible });
    });
  } finally {
    await hub.arreter({ garderMemoryDans });
  }
}

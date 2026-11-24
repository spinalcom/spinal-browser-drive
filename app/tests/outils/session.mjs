// Copyright 2026 SpinalCom - www.spinalcom.com
// Session connectorjs vers un hub de test, et attente de synchronisation complète.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const core = require('spinal-core-connectorjs');
const { spinalCore, FileSystem } = core;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Connexion admin (id hub 168) et chargement du répertoire utilisateur. */
export async function connecter(hub, chemin = '/__users__/admin') {
  const conn = spinalCore.connect(`http://${hub.userId}:${encodeURIComponent('TestAdmin-0001')}@127.0.0.1:${hub.port}/`);
  const dir = await new Promise((ok, ko) => spinalCore.load(conn, chemin, ok, () => ko(new Error(`${chemin} introuvable`))));
  return { conn, dir };
}

/** Tout est envoyé au hub : plus d'identifiant temporaire, file d'envoi vide, aucun envoi en cours. */
export async function synchroniser(ms = 20000) {
  const t = Date.now();
  let stable = 0;
  for (;;) {
    const parInstance = Object.values(FileSystem._insts ?? {}).reduce((n, fs) => n + (fs._data_to_send?.length ? 1 : 0), 0);
    const enAttente = Object.keys(FileSystem._tmp_objects).length + FileSystem._objects_to_send.size
      + (FileSystem._sending_data ? 1 : 0) + (FileSystem._in_mk_chan_eval ? 1 : 0) + parInstance;
    stable = enAttente ? 0 : stable + 1;
    if (stable >= 10) return; // 1 s de calme : couvre les envois différés (debounce 20 ms) et le traitement des changements
    if (Date.now() - t > ms) throw new Error(`synchronisation incomplète (${enAttente} en attente)`);
    await sleep(100);
  }
}

/** Charge la cible d'un Ptr (promesse). */
export const chargerPtr = (ptr) => new Promise((ok) => ptr.load(ok));

/** Ferme les connexions connectorjs pour libérer le processus de test. */
export function deconnecter() {
  for (const fs of FileSystem._insts ?? []) try { fs.close?.(); } catch {}
  FileSystem._insts = [];
}

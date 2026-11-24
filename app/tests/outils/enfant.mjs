// Copyright 2026 SpinalCom - www.spinalcom.com
// Processus enfant de isole.mjs : une session connectorjs, une opération, un instantané.
import { connecter, synchroniser } from './session.mjs';
import { instantane, idsAtteignables } from './instantane.mjs';

process.on('message', async ({ hub, module, fonction, args, instantane: avecInstantane, cible }) => {
  try {
    const s = await connecter(hub);
    const mod = await import(module);
    const racine = cible ? await mod[cible]({ ...s, hub, args }) : s.dir;
    const preexistants = avecInstantane ? await idsAtteignables(racine) : new Set();
    const resultat = await mod[fonction]({ ...s, hub, args });
    await synchroniser();
    const inst = avecInstantane ? await instantane(cible ? await mod[cible]({ ...s, hub, args }) : s.dir, { preexistants }) : null;
    process.send({ ok: true, resultat: resultat ?? null, instantane: inst });
  } catch (e) {
    process.send({ ok: false, erreur: String(e?.message ?? e), pile: e?.stack });
  }
});

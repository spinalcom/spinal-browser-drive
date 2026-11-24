// Copyright 2026 SpinalCom - www.spinalcom.com
// Instantané canonique d'un sous-graphe du hub : JSON trié, comparable entre deux exécutions.
//
// - Chaque modèle est identifié par un CHEMIN CANONIQUE (racine › attribut › nom d'entrée › …), pas par son
//   _server_id : un nouveau nœud a un identifiant différent à chaque exécution.
// - Les modèles PRÉEXISTANTS (connus avant l'opération) gardent en plus leur identité réelle : `@<server_id>`.
// - Un modèle atteint une 2e fois (graphe à plusieurs parents, cycles) n'est pas redéveloppé : on note `→ <chemin>`.
// - Les valeurs volatiles (dates d'écriture, ids temporaires, staticId générés) sont normalisées par des règles.
import { createRequire } from 'node:module';
import { chargerPtr } from './session.mjs';
const require = createRequire(import.meta.url);
const { Model, Lst, Ptr, Str, Val, Bool, Obj, Choice, TypedArray, Directory, File, Path } = require('spinal-core-connectorjs');

/** Clés dont la valeur change à chaque exécution : remplacées par un marqueur. */
export const VOLATILES_DEFAUT = [
  /(^|\.)(date|_created_at|directModificationDate|indirectModificationDate|creationDate|lastUpdate|timestamp|time)$/i,
];
// identifiants générés : guid de spinal-model-graph (xxxx-xxxx-xxxx-<horodatage hex>), UUID, SpinalNode-…
const ID_GENERE = /^(SpinalNode-)?[0-9a-f]{4,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4,}(-[0-9a-f]+)?$/i;
const ID_DANS_TEXTE = /[0-9a-f]{4,8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4,}(-[0-9a-f]+)?/gi;

function typeDe(m) { return m?.constructor?._constructorName || m?.constructor?.name || typeof m; }

/**
 * @param racine modèle connectorjs de départ
 * @param opts.profondeur profondeur max de pointeurs suivis (défaut 40)
 * @param opts.preexistants Set de _server_id connus avant l'opération (pour garder leur identité)
 * @param opts.ignorer (chemin, modele) => true pour ne pas descendre (ex. binaires énormes)
 */
export async function instantane(racine, opts = {}) {
  const { profondeur = 40, preexistants = new Set(), ignorer = () => false, volatiles = VOLATILES_DEFAUT } = opts;
  const vus = new Map(); // modèle -> chemin
  // id généré -> jeton. Deux passes : la 1re repère, pour chaque id, le chemin canonique du nœud qui le porte
  // (`info.id`) ; la 2e remplace chaque occurrence par `<id:chemin>`. Indépendant de l'ordre de génération.
  const ids = opts._ids ?? new Map();
  const jeton = (v) => ids.get(v) ?? '<id:?>';

  async function visiter(m, chemin, prof) {
    if (m === null || m === undefined) return null;
    if (typeof m !== 'object') return m;
    const t = typeDe(m);
    if (vus.has(m)) return { $ref: vus.get(m) };
    vus.set(m, chemin);
    const ident = m._server_id && preexistants.has(m._server_id) ? `@${m._server_id}` : undefined;
    if (ignorer(chemin, m)) return { $type: t, $ignore: true, ...(ident && { $id: ident }) };

    if (m instanceof Str || m instanceof Val || m instanceof Bool) {
      let v = m.get();
      if (typeof v === 'string') v = v.replace(ID_DANS_TEXTE, (x) => jeton(x));
      return v;
    }
    if (m instanceof Choice) return { $type: 'Choice', num: m.num?.get?.(), lst: await visiter(m.lst, `${chemin}.lst`, prof) };
    if (TypedArray && m instanceof TypedArray) return { $type: t, taille: m.size?.(), valeurs: Array.from(m._data ?? []).slice(0, 64) };
    if (m instanceof Ptr) {
      if (prof >= profondeur) return { $type: 'Ptr', $tronque: true };
      if (!m.data?.value && !m.data?.model) return { $type: 'Ptr', vide: true };
      const cible = await chargerPtr(m);
      return { $type: 'Ptr', cible: await visiter(cible, `${chemin}→`, prof + 1) };
    }
    if (m instanceof Lst) {
      const items = [];
      for (let i = 0; i < m.length; i++) items.push(await visiter(m[i], `${chemin}[${cleItem(m[i], i)}]`, prof));
      const sortie = { $type: t, items };
      if (ident) sortie.$id = ident;
      // attributs ajoutés sur une Lst (rare : Directory, relations)
      for (const k of m._attribute_names ?? []) sortie[k] = await visiter(m[k], `${chemin}.${k}`, prof);
      return sortie;
    }
    if (m instanceof Model) {
      const sortie = { $type: t };
      if (ident) sortie.$id = ident;
      // clés triées après normalisation (une clé peut être un identifiant généré : contextIds, relations par id)
      const cles = [...(m._attribute_names ?? [])].sort();
      for (const k of cles) {
        const kn = k.replace(ID_DANS_TEXTE, (x) => jeton(x));
        const c = `${chemin}.${kn}`;
        if (volatiles.some((re) => re.test(c) || re.test(kn))) { sortie[kn] = '<volatile>'; continue; }
        sortie[kn] = await visiter(m[k], c, prof);
      }
      return Object.fromEntries(Object.entries(sortie).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
    }
    return String(m);
  }
  if (!opts._ids) {
    // 1re passe : lieux des identifiants (champ `id` d'un Model `info` → chemin du nœud sans les ids)
    const lieux = new Map();
    await reperer(racine, '$', lieux, new Set(), profondeur);
    return instantane(racine, { ...opts, _ids: lieux });
  }
  return visiter(racine, '$', 0);
}

/** Associe chaque identifiant généré au chemin (noms et types uniquement) du nœud qui le porte. */
async function reperer(m, chemin, lieux, vus, profondeur, prof = 0) {
  if (!m || typeof m !== 'object' || vus.has(m)) return;
  vus.add(m);
  if (m instanceof Ptr) { if (prof < profondeur && (m.data?.value || m.data?.model)) await reperer(await chargerPtr(m), `${chemin}→`, lieux, vus, profondeur, prof + 1); return; }
  if (m instanceof Lst) { for (let i = 0; i < m.length; i++) await reperer(m[i], `${chemin}[${cleItem(m[i], i).replace(ID_DANS_TEXTE, '*')}]`, lieux, vus, profondeur, prof); return; }
  if (!(m instanceof Model)) return;
  const id = m.info?.id?.get?.();
  if (typeof id === 'string' && ID_GENERE.test(id) && !lieux.has(id)) {
    lieux.set(id, `<id:${m.info.type?.get?.() ?? '?'}:${m.info.name?.get?.() ?? '?'}>`);
  }
  for (const k of [...(m._attribute_names ?? [])].sort()) await reperer(m[k], `${chemin}.${k.replace(ID_DANS_TEXTE, '*')}`, lieux, vus, profondeur, prof);
}

/** Clé stable d'un élément de liste : nom d'un File/nœud si présent, sinon son indice. */
function cleItem(it, i) {
  const n = it?.name?.get?.() ?? it?.info?.name?.get?.();
  return n !== undefined ? `${i}:${n}` : String(i);
}

/** Ensemble des _server_id atteignables (pour marquer les préexistants avant une opération). */
export async function idsAtteignables(racine, profondeur = 40) {
  const ids = new Set(), vus = new Set();
  async function v(m, prof) {
    if (!m || typeof m !== 'object' || vus.has(m)) return;
    vus.add(m);
    if (m._server_id) ids.add(m._server_id);
    if (m instanceof Ptr) { if (prof < profondeur && (m.data?.value || m.data?.model)) await v(await chargerPtr(m), prof + 1); return; }
    if (m instanceof Lst) for (let i = 0; i < m.length; i++) await v(m[i], prof);
    for (const k of m._attribute_names ?? []) await v(m[k], prof);
  }
  await v(racine, 0);
  return ids;
}

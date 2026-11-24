// Copyright 2026 SpinalCom - www.spinalcom.com
// Comparaison lisible de deux instantanés canoniques (instantane.mjs).
// Sortie : liste d'écarts { chemin, type: '+'|'-'|'~', avant, apres } et rendu texte.

export function comparer(a, b, chemin = '$', ecarts = []) {
  if (a === b) return ecarts;
  const ta = typeof a, tb = typeof b;
  if (a === undefined) { ecarts.push({ chemin, type: '+', apres: resume(b) }); return ecarts; }
  if (b === undefined) { ecarts.push({ chemin, type: '-', avant: resume(a) }); return ecarts; }
  if (ta !== 'object' || tb !== 'object' || a === null || b === null || Array.isArray(a) !== Array.isArray(b)) {
    ecarts.push({ chemin, type: '~', avant: resume(a), apres: resume(b) });
    return ecarts;
  }
  if (Array.isArray(a)) {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) comparer(a[i], b[i], `${chemin}[${i}]`, ecarts);
    return ecarts;
  }
  for (const k of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) comparer(a[k], b[k], `${chemin}.${k}`, ecarts);
  return ecarts;
}

function resume(v) {
  if (v && typeof v === 'object') {
    const s = JSON.stringify(v);
    return s.length > 160 ? s.slice(0, 157) + '…' : s;
  }
  return v;
}

export function texte(ecarts) {
  return ecarts.map((e) => e.type === '~' ? `~ ${e.chemin} : ${JSON.stringify(e.avant)} → ${JSON.stringify(e.apres)}`
    : e.type === '+' ? `+ ${e.chemin} : ${JSON.stringify(e.apres)}` : `- ${e.chemin} : ${JSON.stringify(e.avant)}`).join('\n');
}

/**
 * Retire les écarts déclarés acceptés (corrections voulues d'un bug de l'ancien code).
 * accepte : [{ cas: 'DR-05.3', chemin: RegExp|string, type?: '+'|'-'|'~' }]
 */
export function filtrerAcceptes(ecarts, acceptes = []) {
  return ecarts.filter((e) => !acceptes.some((x) => (!x.type || x.type === e.type)
    && (x.chemin instanceof RegExp ? x.chemin.test(e.chemin) : x.chemin === e.chemin)));
}

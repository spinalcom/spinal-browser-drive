// Copyright 2026 SpinalCom - www.spinalcom.com
// Plateau des tâches (01-architecture §7) : dépôts, conversions, opérations par lot.
import type { Tache } from '$lib/ui/types';

export const taches = $state<Tache[]>([]);
export const plateau = $state({ ouvert: false });

export function ajouterTache(t: Tache): Tache {
  taches.unshift(t);
  return taches[0];
}
export function majTache(id: string, patch: Partial<Tache>) {
  const t = taches.find((x) => x.id === id);
  if (t) Object.assign(t, patch);
}
export function effacerTerminees() {
  for (let i = taches.length - 1; i >= 0; i--) if (!['attente', 'cours', 'envoyee'].includes(taches[i].etat)) taches.splice(i, 1);
}
export const enCours = () => taches.filter((t) => ['attente', 'cours', 'envoyee'].includes(t.etat)).length;
export const enErreur = () => taches.filter((t) => t.etat === 'erreur').length;

// Copyright 2026 SpinalCom - www.spinalcom.com
// Adaptateur de réactivité (01-architecture §4) : un modèle spinalcore n'entre jamais dans $state.
// On s'abonne (bind), on recopie une vue simple dans un $state, et on se désabonne au démontage.
// Le compteur `liensActifs` sert aux tests de fuite (zéro abonnement restant après fermeture).
import type { Modele } from './connecteur';

export const compteurs = $state({ liensActifs: 0 });

/**
 * Suit un modèle : `lire` produit une valeur simple (pas de modèle dedans) recalculée à chaque changement,
 * regroupés par image (requestAnimationFrame) pour les rafales d'écritures.
 * À appeler dans un composant (utilise $effect pour se désabonner).
 */
export function suivre<T>(modele: () => Modele | null | undefined, lire: (m: Modele) => T, initial: T): { readonly valeur: T } {
  let valeur = $state.raw<T>(initial);
  $effect(() => {
    const m = modele();
    if (!m) { valeur = initial; return; }
    let prevu = 0;
    const maj = () => {
      if (prevu) return;
      prevu = requestAnimationFrame(() => { prevu = 0; valeur = lire(m); });
    };
    valeur = lire(m);
    const p = m.bind(maj, false);
    compteurs.liensActifs++;
    return () => { m.unbind(p); cancelAnimationFrame(prevu); compteurs.liensActifs--; };
  });
  return { get valeur() { return valeur; } };
}

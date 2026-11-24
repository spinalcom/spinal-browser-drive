// Copyright 2026 SpinalCom - www.spinalcom.com
// Calcul de la fenêtre visible d'une liste à hauteur de ligne fixe. Pur, testé par Vitest.

export interface Fenetre { debut: number; fin: number; avant: number; apres: number }

/** Rend l'écran visible plus une marge d'un demi-écran de chaque côté (environ 2 écrans au total). */
export function fenetre(total: number, hauteurLigne: number, defilement: number, hauteurVue: number): Fenetre {
  if (total <= 0 || hauteurLigne <= 0) return { debut: 0, fin: 0, avant: 0, apres: 0 };
  const parEcran = Math.max(1, Math.ceil(hauteurVue / hauteurLigne));
  const marge = Math.ceil(parEcran / 2);
  const premier = Math.floor(Math.max(0, defilement) / hauteurLigne);
  const debut = Math.max(0, Math.min(total - 1, premier - marge));
  const fin = Math.min(total, premier + parEcran + marge);
  return { debut, fin, avant: debut * hauteurLigne, apres: (total - fin) * hauteurLigne };
}

/** Défilement nécessaire pour rendre la ligne i visible (null si déjà visible). */
export function defilementPour(i: number, hauteurLigne: number, defilement: number, hauteurVue: number): number | null {
  const haut = i * hauteurLigne;
  const bas = haut + hauteurLigne;
  if (haut < defilement) return haut;
  if (bas > defilement + hauteurVue) return bas - hauteurVue;
  return null;
}

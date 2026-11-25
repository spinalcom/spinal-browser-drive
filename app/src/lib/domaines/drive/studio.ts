// Copyright 2026 SpinalCom - www.spinalcom.com
// Lien vers le Studio historique (/html/viewer/?path=…), le temps que le nouveau Studio existe.
// Même chiffrement que SpinalDrive_App_svf_viewer.js (AES-CTR 128, compteur initial 5, clé fixe), via WebCrypto.
const CLE = new Uint8Array([10, 95, 124, 68, 55, 24, 90, 57, 34, 65, 81, 22, 75, 7, 110, 1]);

export async function cheminChiffre(chemin: string): Promise<string> {
  const cle = await crypto.subtle.importKey('raw', CLE, { name: 'AES-CTR' }, false, ['encrypt']);
  const compteur = new Uint8Array(16);
  compteur[15] = 5; // aes-js : new Counter(5) = entier 128 bits big-endian
  const chiffre = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-CTR', counter: compteur, length: 128 }, cle, new TextEncoder().encode(chemin)));
  return encodeURIComponent(Array.from(chiffre, (b) => b.toString(16).padStart(2, '0')).join(''));
}

/** URL du Studio pour un fichier jumeau, à partir de son chemin dans le Drive de l'utilisateur. */
export async function urlStudio(utilisateur: string, dossiers: string[], nomFichier: string): Promise<string> {
  const chemin = ['/__users__', utilisateur, ...dossiers, nomFichier].join('/');
  return `/html/viewer/?path=${await cheminChiffre(chemin)}`;
}

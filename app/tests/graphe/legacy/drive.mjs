// Copyright 2026 SpinalCom - www.spinalcom.com
// Code historique du Drive, recopié SANS modification de logique, pour servir de référence aux tests de graphe.
// Seuls changements : `window.X` → import, injection Angular retirée (paramètres explicites).
// Source : browser/spinal-browser-drive (branche dev, commit 0e66643), src/services/spinalFilesystem.js.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { Directory } = require('spinal-core-connectorjs');

/** spinalFilesystem.newFolder (l. 117-129) : `f` = dossier parent, `name` = nom saisi. */
export function newFolder(f, name) {
  if (f) {
    let folder_name = name;
    let base_folder_name = folder_name.replace(/\([\d]*\)/g, '');
    let x = 0;
    while (f.has(folder_name)) {
      folder_name = base_folder_name + '(' + x + ')';
      x++;
    }
    f.add_file(folder_name, new Directory());
  }
}

/** Validation du nom (SpinalDrive_App_newFolder.js, action) : renvoie false si refusé. */
export function nomDossierValide(result) {
  let regex = /^[a-z0-9 ._-]+(\.[a-z0-9_-]+)?$/gim;
  return regex.test(result) !== false;
}

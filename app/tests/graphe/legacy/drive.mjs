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

// ---- Renommer : SpinalDrive_App_renameFile.js (action), commit 0e66643 ----
/** Renvoie le message d'erreur historique, ou null si renommé. `dir` = dossier courant, `f` = fichier. */
export function renameFile(dir, f, result) {
  if (f.name.get() === result) return null;
  let regex = /^[a-z0-9 ._-]+(\.[a-z0-9_-]+)?$/gim;
  if (regex.test(result) === false) return `The name "${result}" is not a valid name.`;
  for (let i = 0; i < dir.length; i++) {
    if (dir[i].name.get() === result) return 'Error rename: File with this name already exist.';
  }
  f.name.set(result);
  return null;
}

// ---- Supprimer : SpinalDrive_App_delete.js (SpinalDrive_App_FileExplorer_delete.action) ----
export function deleteFile(curr_dir, file) {
  let f = file;
  if (f) {
    let m_parent = curr_dir;
    for (var i = 0; i < m_parent.length; i++) {
      if (m_parent[i]._server_id == f._server_id && file.name.get() == m_parent[i].name.get()) {
        m_parent.remove_ref(m_parent[i]);
        break;
      }
    }
  }
}

// ---- Déplacer : FileExplorerCtrl.js, folderDropCfg.drop (déplacement interne), sans le contrôle de chemin (UI) ----
export function moveFiles(curr_dir, m_tar, selected) {
  for (let i = 0; i < selected.length; i++) curr_dir.remove_ref(selected[i]);
  for (let i = 0; i < selected.length; i++) m_tar.push(selected[i]);
}

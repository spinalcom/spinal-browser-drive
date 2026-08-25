/*
 * Copyright 2026 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { SpinalDrive_App } from "spinal-env-drive-core";
import { FileSystem } from "spinal-core-connectorjs";

/**
 * SpinalDrive_App_FileExplorer_rename
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_rename extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_rename.
   * @memberof SpinalDrive_App_FileExplorer_rename
   */
  constructor() {
    super("RenameFileExplorer", "Rename...", 1, "edit", "Rename a File");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_rename
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let f = FileSystem._objects[obj.file._server_id];
    var confirm = mdDialog
      .prompt()
      .title("Rename")
      .placeholder("File Name")
      .ariaLabel("Rename")
      .clickOutsideToClose(true)
      .required(true)
      .ok("Rename!")
      .cancel("Cancel");
    if (f && f.name && f.name.get()) {
      confirm.initialValue(f.name.get());
    }

    mdDialog.show(confirm).then(
      function (result) {
        if (f.name.get() === result) return;
        let regex = /^[a-z0-9 ._-]+(\.[a-z0-9_-]+)?$/gim;
        if (regex.test(result) === false) {
          let mdToast = obj.scope.injector.get("$mdToast");
          mdToast.show(
            mdToast
              .simple()
              .theme("error-toast")
              .textContent(`The name "${result}" is not a valid name.`)
          );
          return;
        }
        for (let i = 0; i < obj.scope.curr_dir.length; i++) {
          if (obj.scope.curr_dir[i].name.get() === result) {
            let mdToast = obj.scope.injector.get("$mdToast");

            mdToast.show(
              mdToast
                .simple()
                .theme("error-toast")
                .textContent("Error rename: File with this name already exist.")
            );
            // mdToast.showSimple();
            return;
          }
        }
        f.name.set(result);
        // .newFolder(null, obj, result);
      },
      function () { }
    );
  }
}

export { SpinalDrive_App_FileExplorer_rename as FileExplorerRename };

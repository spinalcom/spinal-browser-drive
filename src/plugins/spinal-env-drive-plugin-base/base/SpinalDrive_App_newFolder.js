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
import { Directory } from "spinal-core-connectorjs";

/**
 * SpinalDrive_App_FileExplorer_currdir_newFolder
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_currdir_newFolder extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_currdir_newFolder.
   * @memberof SpinalDrive_App_FileExplorer_currdir_newFolder
   */
  constructor() {
    super(
      "NewFolderFileExplorerCurrDir",
      "New Folder...",
      1,
      "create_new_folder",
      "Create a new Folder"
    );
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_currdir_newFolder
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let spinalFileSystem = obj.scope.injector.get("spinalFileSystem");
    var confirm = mdDialog
      .prompt()
      .title("New Folder")
      .placeholder("Untitled folder")
      .ariaLabel("New Folder")
      .initialValue("Untitled folder")
      .clickOutsideToClose(true)
      .required(true)
      .ok("Create!")
      .cancel("Cancel");
    obj.original = {
      model: obj.model._server_id
    };

    mdDialog.show(confirm).then(
      result => {
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
        spinalFileSystem.newFolder(null, obj, result);
        let username = obj.scope.injector.get("authService").get_user()
          .username;
        this.log(
          obj.model[obj.model.length - 1],
          username,
          obj.item.description
        );
      },
      function () { }
    );
  }
}

/**
 * SpinalDrive_App_FolderExplorer_newFolder
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FolderExplorer_newFolder extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FolderExplorer_newFolder.
   * @memberof SpinalDrive_App_FolderExplorer_newFolder
   */
  constructor() {
    super(
      "NewFolderFolderExplorer",
      "New Folder...",
      1,
      "fa fa-folder",
      "Create a new Folder"
    );
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FolderExplorer_newFolder
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let ngSpinalCore = obj.scope.injector.get("ngSpinalCore");
    var confirm = mdDialog
      .prompt()
      .title("New Folder")
      .placeholder("Untitled folder")
      .ariaLabel("New Folder")
      .clickOutsideToClose(true)
      .initialValue("Untitled folder")
      .required(true)
      .ok("Create!")
      .cancel("Cancel");
    mdDialog.show(confirm).then(
      result => {
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

        const file = window.FileSystem._objects[obj.node.original.fileId];
        if (!file) return;

        return ngSpinalCore.loadModelPtr(file).then(dir => {
          if (dir) {
            dir.force_add_file(result, new Directory(), {
              model_type: "Directory"
            });
            let username = obj.scope.injector.get("authService").get_user()
              .username;
            this.log(dir[dir.length - 1], username, this.description);
          }
        });
      },
      function () { }
    );
  }
}

export {
  SpinalDrive_App_FileExplorer_currdir_newFolder as FileExplorerCurrDirNewFolder,
  SpinalDrive_App_FolderExplorer_newFolder as FolderExplorerNewFolder
};

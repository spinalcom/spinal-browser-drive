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
import { ModeOfOperation, Counter, utils } from "aes-js";

/**
 * SpinalDrive_App_FileExplorer_svf_viewer
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_svf_viewer extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_svf_viewer.
   * @memberof SpinalDrive_App_FileExplorer_svf_viewer
   */
  constructor() {
    super(
      "OpenSvfFileExplorer",
      "ST Studio",
      "10",
      "location_city",
      "ST Studio"
    );
    this.order_priority = 5;
  }
  get #k() {
    return [10, 95, 124, 68, 55, 24, 90, 57, 34, 65, 81, 22, 75, 7, 110, 1];
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_svf_viewer
   */
  action(obj) {
    let authService = obj.scope.injector.get("authService");
    let fs_path = obj.scope.fs_path;
    let username = authService.get_user().username;
    let path = "/__users__/" + username;
    for (var i = 1; i < fs_path.length; i++) {
      path += "/" + fs_path[i].name;
    }
    path += "/" + obj.file.name;
    let myWindow = window.open("", "");
    let location = "/html/viewer/?path=" + this.encrypt(path);
    myWindow.document.location = location;
    myWindow.focus();
  }

  encrypt(text) {
    var key = this.#k;
    var aesCtr = new ModeOfOperation.ctr(key, new Counter(5));
    var textBytes = utils.utf8.toBytes(text);
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = utils.hex.fromBytes(encryptedBytes);
    return encodeURIComponent(encryptedHex);
  }


  /**
   * method to know if the app is needed to be shown.
   * @param {Object} d node of the tree selectionned
   * @returns {boolean}
   * @memberof SpinalDrive_App_FileExplorer_svf_viewer
   */
  is_shown(d) {
    if (d && d.file && d.file._server_id) {
      let file = window.FileSystem._objects[d.file._server_id];
      if (
        file &&
        file instanceof File &&
        file._info.model_type &&
        (file._info.model_type.get() === "BIM Project" ||
          file._info.model_type.get() === "Digital twin")
      ) {
        return true;
      }
    }
    return false;
  }
}

export const FileExplorerSvfViewer = SpinalDrive_App_FileExplorer_svf_viewer;
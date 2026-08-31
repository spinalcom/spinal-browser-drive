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

const angular = require("angular");
import { SpinalDrive_App_share } from "./SpinalDrive_app_share";

/**
 * SpinalDrive_App_FileExplorer_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_FileExplorer_share extends SpinalDrive_App_share {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_share.
   * @memberof SpinalDrive_App_FileExplorer_share
   */
  constructor() {
    super(
      "ShareFileExplorer",
      "Share...",
      2,
      "share",
      "Share Models with other Users"
    );
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_share
   */
  action(obj) {
    let templateCache = obj.scope.injector.get("$templateCache");
    let spinalModelDictionary = obj.scope.injector.get("spinalModelDictionary");
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let ngSpinalCore = obj.scope.injector.get("ngSpinalCore");
    mdDialog.show({
      controller: [
        "$scope",
        "$mdDialog",
        "model_server_id",
        "spinalModelDictionary",
        "mdDialog",
        "ngSpinalCore",
        SpinalDrive_App_share.DialogShareCtrl
      ],
      template: templateCache.get("Spinal_App_ShareTemplate.html"),
      parent: angular.element(document.body),
      targetEvent: obj.evt,
      clickOutsideToClose: true,
      locals: {
        model_server_id: obj.file._server_id,
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      }
    });
  }
}

export { SpinalDrive_App_FileExplorer_share as FileExplorerShare };
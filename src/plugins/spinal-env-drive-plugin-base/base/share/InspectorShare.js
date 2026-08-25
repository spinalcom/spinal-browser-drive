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
import { SpinalDrive_App_share } from "./SpinalDrive_app_share";
const angular = require("angular");

/**
 * SpinalDrive_App_Inspector_share
 * @extends {SpinalDrive_App_share}
 */
class SpinalDrive_App_Inspector_share extends SpinalDrive_App_share {
  /**
   * Creates an instance of SpinalDrive_App_Inspector_share.
   * @memberof SpinalDrive_App_Inspector_share
   */
  constructor() {
    super(
      "ShareInspector",
      "Share...",
      3,
      "share",
      "Share Models with other Users"
    );
    // super("ShareInspector", "Share...", 3, "share", "Share Models with other Users", "share", ["all"], "all");
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_Inspector_share
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
      clickOutsideToClose: true,
      locals: {
        model_server_id: obj.model_server_id,
        spinalModelDictionary: spinalModelDictionary,
        mdDialog: mdDialog,
        ngSpinalCore: ngSpinalCore
      }
    });
  }

  /**
   * method to know if the app is needed to be shown.
   * if the method is not defined then the model is shown by default
   * @param {Object} d node of the tree selectionned
   * @returns {boolean}
   * @memberof SpinalDrive_App_Inspector_share
   */
  is_shown() {
    return true;
  }
}

export { SpinalDrive_App_Inspector_share as InspectorShare };

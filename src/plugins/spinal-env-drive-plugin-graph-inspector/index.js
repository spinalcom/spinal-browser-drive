/*
 * Copyright 2021 SpinalCom - www.spinalcom.com
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

/**
 * SpinalDrive_App_FileExplorer_inspector
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_Graph_inspector extends SpinalDrive_App {

  /**
   * Creates an instance of SpinalDrive_App_Graph_inspector.
   * @memberof SpinalDrive_App_Graph_inspector
   */
  constructor() {
    super("ST_GRAPHINSPECTOR", "ST Graph Inspector", 3000, "device_hub",
      "ST_GRAPHINSPECTOR");
    this.order_priority = 4;
  }
  /**
   * method to handle the selection
   * 
   * @param {any} element 
   * @memberof SpinalDrive_App_Graph_inspector
   */
  action(obj) {
    const node = FileSystem._objects[obj.file._server_id];
    node._ptr.load((x) => {
      let myWindow = window.open('', '');
      let location = "/html/graph-inspector/?id=" + x._server_id;
      myWindow.document.location = location;
      myWindow.focus();
    });
  }

  /**
   * method to know if the app is needed to be shown.
   * @param {Object} d node of the tree selectionned
   * @returns {boolean}
   * @memberof SpinalDrive_App_Graph_inspector
   */
  is_shown() {
    return Promise.resolve(true);
  }
}
// const spinalDrive_Env = new SpinalDrive_Env()
window.spinalDrive_Env.add_applications('FileExplorer', new SpinalDrive_App_Graph_inspector());

// "spinal-env-preventive-task-btn": "1.0.2",
// "spinal-env-drive-plugin-forge": "1.0.7",
//

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
 * SpinalDrive_App_FileExplorer_Download
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_FileExplorer_Download extends SpinalDrive_App {
  /**
   * Creates an instance of SpinalDrive_App_FileExplorer_Download.
   * @memberof SpinalDrive_App_FileExplorer_Download
   */
  constructor() {
    super(
      "DownloadFileExplorer",
      "Download...",
      15,
      "file_download",
      "Download a File"
    );
  }
  /**
   * method to handle the selection
   *
   * @param {any} element
   * @memberof SpinalDrive_App_FileExplorer_Download
   */
  action(obj) {
    let mdDialog = obj.scope.injector.get("$mdDialog");
    let f = FileSystem._objects[obj.file._server_id];
    var confirm = mdDialog
      .confirm()
      .title("Do you want download " + f.name.get() + " ?")
      .ariaLabel("Download")
      .clickOutsideToClose(true)
      .ok("Download!")
      .cancel("Cancel");

    mdDialog.show(confirm).then(
      function () {
        if (f._info.model_type.get() == "Path") {
          // window.open("/sceen/_?u=" + model._server_id, "Download");
          var element = document.createElement("a");
          element.setAttribute("href", "/sceen/_?u=" + f._ptr.data.value);
          element.setAttribute("download", f.name.get());
          element.style.display = "none";
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
      },
      function () { }
    );
  }
  is_shown(d) {
    if (d && d.file && d.file._server_id) {
      let file = FileSystem._objects[d.file._server_id];
      if (file && file._info && file._info.model_type) {
        if (file._info.model_type.get() === "Path") {
          return true;
        }
      }
    }
    return false;
  }
}

export { SpinalDrive_App_FileExplorer_Download as FileExplorerDownload };

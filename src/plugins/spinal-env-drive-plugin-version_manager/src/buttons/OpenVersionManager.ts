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

import { FileSystem } from 'spinal-core-connectorjs_type';

const spinalEnvDriveCore = require('spinal-env-drive-core');
require('spinal-core-connectorjs');
const angular = require('angular');

angular
  .module('app.controllers')
  .run([
    'fileVersionManagerService',
    function (fileVersionManagerService) {
      class SpinalDriveAppFileExplorerOpenVersionManager extends
        spinalEnvDriveCore.SpinalDrive_App {
        constructor() {
          super('OpenVersionManager', 'Open the version manager',
            31, 'history', 'Open the version manager');
          this.order_priority = 0;
        }
        action(obj) {
          const fileModel = <spinal.File<any>>(FileSystem._objects[obj.file._server_id]);
          fileVersionManagerService.openVersionPanel(fileModel);
        }

        is_shown(file) {
          const modelType = file.file.model_type;
          if (modelType === 'Path'
            // || modelType.toLocaleLowerCase() === "Digital twin".toLocaleLowerCase()
          ) {
            return true;
          }
          return false;
        }
      }

      (<any>window).spinalDrive_Env.add_applications(
        'FileExplorer',
        new SpinalDriveAppFileExplorerOpenVersionManager(),
      );
    },
  ]);

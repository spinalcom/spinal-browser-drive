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

import { FileSystem } from 'spinal-core-connectorjs';
import {
  DIGITAL_TWIN_OPEN_MANAGER_BUTTON,
  DIGITAL_TWIN_OPEN_MANAGER_BUTTON_DESCRIPTION,
  DIGITAL_TWIN_FILE_MODEL_TYPE,
  DIGITAL_TWIN_CREATE_MANAGER_BUTTON,
  DIGITAL_TWIN_CREATE_MANAGER_BUTTON_DESCRIPTION,
} from '../contant';

import spinalEnvDriveCore from 'spinal-env-drive-core';
require('spinal-core-connectorjs');
import angular from 'angular';

angular
  .module('app.controllers')
  .run([
    'digitalTwinManagerService',
    function (digitalTwinManagerService) {
      const anyWin: any = window;

      // create open digital twin in FE top menu
      class SpinalDriveAppFileExplorerOpenDigitalTwinManager extends
        spinalEnvDriveCore.SpinalDrive_App {
        constructor() {
          super('OpenDigitalTwinManager', DIGITAL_TWIN_OPEN_MANAGER_BUTTON,
            35, 'settings_applications', DIGITAL_TWIN_OPEN_MANAGER_BUTTON_DESCRIPTION);
          this.order_priority = 0;
        }
        action(obj) {
          const fileModel = <spinal.File<any>>(FileSystem._objects[obj.file._server_id]);
          digitalTwinManagerService.openPanel(fileModel);
        }

        is_shown(f) {
          const modelType = f.file.model_type;
          return (modelType.toLocaleLowerCase() ===
            DIGITAL_TWIN_FILE_MODEL_TYPE.toLocaleLowerCase());
        }
      }
      anyWin.spinalDrive_Env.add_applications(
        'FileExplorer',
        new SpinalDriveAppFileExplorerOpenDigitalTwinManager(),
      );

      // create digital twin in FE top menu
      class SpinalDriveAppCurrFileExplorerCreateDigitalTwinManager extends
        spinalEnvDriveCore.SpinalDrive_App {
        constructor() {
          super('CreateDigitalTwin', DIGITAL_TWIN_CREATE_MANAGER_BUTTON,
            36, 'location_city', DIGITAL_TWIN_CREATE_MANAGER_BUTTON_DESCRIPTION);
          this.order_priority = 0;
        }
        action(obj) {

          const mdDialog = obj.scope.injector.get('$mdDialog');
          const confirm = mdDialog
            .prompt()
            .title('New Digital twin')
            .placeholder('Digital twin\'s name')
            .ariaLabel('New Digital twin')
            .initialValue('Digital twin')
            .clickOutsideToClose(true)
            .required(true)
            .ok('Create !')
            .cancel('Cancel');
          obj.original = {
            model: obj.model._server_id,
          };

          mdDialog.show(confirm).then(
            filename => {
              if (filename && obj && obj.model && obj.model._server_id) {
                const directory = FileSystem._objects[obj.model._server_id];
                digitalTwinManagerService.newDigitalTwin(directory, filename);
              } else {
                console.log('Error Directory model not foud');
              }
            },
            function () { },
          );
        }

        is_shown(file) {
          return true;
        }
      }
      anyWin.spinalDrive_Env.add_applications(
        'FileExplorerCurrDir',
        new SpinalDriveAppCurrFileExplorerCreateDigitalTwinManager(),
      );

    },
  ]);


/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
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

const angular = require('angular');
import { File, FileSystem } from 'spinal-core-connectorjs';
import digitalTwinCtrl from '../controller/digitalTwinManagerCtrl';
import loadModelPtr from '../utils/loadModelPtr';
import {
  SpinalGraphService,
  SpinalGraph,
} from 'spinal-env-viewer-graph-service';
import matchKnownExt from '../utils/knownExt';
import { BimFileService, AssetFile } from './BimFileService';
import { fileVersionState } from './fileVersionState';
import { DIGITAL_TWIN_FILE_MODEL_TYPE, DIGITAL_TWIN_PANEL_TITLE } from '../contant';

angular
  .module('app.services')
  .controller(digitalTwinCtrl.ctrlName, digitalTwinCtrl.ctrl);

angular
  .module('app.services')
  .factory('digitalTwinManagerService', [
    'goldenLayoutService', '$q', '$templateCache', '$http', 'spinalFileSystem',
    function (goldenLayoutService, $q, $templateCache, $http, spinalFileSystem) {
      let lastGraph: SpinalGraph<any> = null;
      const bimFileService = new BimFileService(onChangeModel);
      const loadTemplateFunc = (uri: string, name: string) => {
        return $http.get(uri).then(
          response => {
            $templateCache.put(name, response.data);
          },
          () => {
            console.error(`Cannot load the file ${uri}`);
          },
        );
      };
      const toload = [
        {
          uri: digitalTwinCtrl.templateUri,
          name: digitalTwinCtrl.templateName,
        },
      ];
      let initPromise = null;
      const init = (): Promise<void> => {
        if (initPromise !== null) return initPromise.promise;
        initPromise = $q.defer();
        $q.all(toload.map((elem) => {
          return loadTemplateFunc(elem.uri, elem.name);
        })).then(() => {
          initPromise.resolve();
        }).catch((e) => {
          console.error(e);
          const prom = initPromise;
          initPromise = null;
          prom.reject();
        });

        return initPromise.promise;
      };

      const openPanel = (file: spinal.File<any>): Promise<any> => {
        return factory.init().then(() => {
          const oldFile = factory.lastFile;
          factory.lastFile = file;
          if (factory.controllerOnChange === null) {
            const cfg = {
              isClosable: true,
              title: DIGITAL_TWIN_PANEL_TITLE,
              type: 'component',
              componentName: 'SpinalHome',
              width: 20,
              componentState: {
                template: digitalTwinCtrl.templateName,
                module: 'app.controllers',
                controller: digitalTwinCtrl.ctrlName,
              },
            };
            goldenLayoutService.createChild(cfg);
            function onItemDestroy(item) {
              if (item && item.config && item.config.componentState &&
                item.config.componentState.controller &&
                item.config.componentState.controller === digitalTwinCtrl.ctrlName) {
                controllerDestroy();
                goldenLayoutService.myLayout.off('itemDestroyed', onItemDestroy);
              }
            }
            goldenLayoutService.myLayout.on('itemDestroyed', onItemDestroy);
          } else if (oldFile !== factory.lastFile) {
            return loadModelPtr(factory.lastFile._ptr)
              .then((graph: SpinalGraph<any>) => {
                lastGraph = graph;
                bimFileService.resetProcess();
                SpinalGraphService.nodes = {};
                SpinalGraphService.nodesInfo = {};
                return SpinalGraphService.setGraph(graph);
              }).then(() => bimFileService.addToProces(lastGraph, false)
              );
          }
        });
      };

      function getState(assetFiles: AssetFile) {
        const fileModel = assetFiles.FileVersionModel;
        if (typeof fileModel.state === 'undefined') {
          return 'Not Converted.';
        }

        const state = fileModel.state.get();
        for (let idx = 0; idx < fileVersionState.length; idx++) {
          if (idx === state) {
            return fileVersionState[idx];
          }
        }
        return 'Not Converted.';
      }
      async function onChangeModel() {
        if (factory.controllerOnChange === null) return;
        const assetFiles = await bimFileService.getAssetFiles();
        const res = assetFiles.map((assetFiles) => {
          return {
            name: assetFiles.name,
            nodeId: assetFiles.nodeId,
            state: getState(assetFiles),
            description: assetFiles.FileVersionModel.description.get(),
            versionId: assetFiles.FileVersionModel.versionId.get(),
            date: assetFiles.FileVersionModel.date.get(),
          };
        });

        factory.controllerOnChange({
          filename: factory.lastFile.name.get(),
          assetFiles: res,
        });
      }

      const controllerOpenRegister = (funcOnChange, funcOnDestroy): Promise<any> => {
        factory.controllerOnChange = funcOnChange;
        factory.controllerDestroyFunc = funcOnDestroy;
        return loadModelPtr(factory.lastFile._ptr)
          .then((graph: SpinalGraph<any>) => {
            lastGraph = graph;
            return SpinalGraphService.setGraph(lastGraph).then((e) => {
              bimFileService.addToProces(graph, false);
              return e;
            });
          });
      };
      const controllerDestroy = () => {
        bimFileService.resetProcess();
        factory.controllerDestroyFunc();
        factory.controllerOnChange = null;
      };
      const newDigitalTwin = (directory: spinal.Directory<any>, filename: string) => {
        const graph = new SpinalGraph();
        directory.force_add_file(filename, graph, {
          model_type: DIGITAL_TWIN_FILE_MODEL_TYPE,
        });
      };
      const getFilesDropped = (): {
        fileMatch: spinal.File<any>[],
        fileNotMatch: spinal.File<any>[],
      } => {
        const fileMatch = [];
        const fileNotMatch = [];
        const selected = spinalFileSystem.FE_selected_drag;
        if (selected && selected.length > 0) { // change to multiple selection later
          for (let idx = 0; idx < selected.length; idx++) {
            const fileToPush = selected[idx];
            let match = false;
            const modelFile = FileSystem._objects[fileToPush._server_id];
            // check if file then if file == 'Path' or 'HttpPath'
            if (modelFile && modelFile instanceof File &&
              modelFile._info && modelFile._info.model_type) {
              const modelType = modelFile._info.model_type.get();
              if (modelType === 'Path' || modelType === 'HttpPath') {
                const filename = modelFile.name.get();
                if (matchKnownExt(filename) === true) {
                  match = true;
                  fileMatch.push(modelFile);
                }
              }
            }
            if (match === false) {
              fileNotMatch.push(modelFile);
            }
          }
        }
        return {
          fileMatch,
          fileNotMatch,
        };
      };

      const addFileDropped = () => {
        const filesDropped = getFilesDropped();
        const filesMatch = filesDropped.fileMatch;
        return Promise.all(filesMatch.map((fileMatch) => {
          return bimFileService.addAssetFile(fileMatch);
        }));
      };
      const removeAssetFile = (nodeId: string) => {
        return bimFileService.removeAssetFile(nodeId);
      };
      const convertAsssetFile = (nodeId: string) => {
        return bimFileService.convertAsssetFile(nodeId);
      };

      init();
      const factory = {
        convertAsssetFile,
        removeAssetFile,
        addFileDropped,
        getFilesDropped,
        init,
        newDigitalTwin,
        openPanel,
        controllerOpenRegister,
        controllerDestroy,
        controllerOnChange: null,
        controllerDestroyFunc: null,
        lastFile: null,
      };

      return factory;
    },
  ]);

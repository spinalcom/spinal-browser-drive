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
import mergeArray from '../utils/mergeArray';
import delayFctGen from '../utils/delayFctGen';
const debounce = require('lodash.debounce');

type DTwinAsset = {
  name: string,
  nodeId: string,
  state?: number,
  description: string,
  versionId: number,
  date: any,
};

const controller = {
  ctrlName: 'digitalTwinManagerCtrl',
  templateName: 'digital_twin_manager.html',
  templateUri: 'app/templates/digital_twin_manager.html',
  ctrl: [
    '$scope',
    'digitalTwinManagerService',
    'spinalFileSystem',
    '$mdDialog',
    function ($scope, digitalTwinManagerService, spinalFileSystem, $mdDialog) {
      const assets: DTwinAsset[] = [];
      $scope.filename = '';
      $scope.dropOnFolder = false;
      $scope.assets = assets;
      $scope.dropIcon = {
        icon: '3d_rotation',
        style: {
          fill: '#FFF',
        },
      };
      const closeDropDebounced = debounce(() => {
        $scope.dropOnFolder = false;
        $scope.$apply();
      }, 500);
      const setDropIcon = (icon: string, color: string, doApply = true) => {
        $scope.dropIcon.icon = icon;
        $scope.dropIcon.style.fill = color;
        if (doApply) $scope.$apply();
      };
      $scope.onClickDeleteAssset = (evemt, item) => {
        digitalTwinManagerService.removeAssetFile(item.nodeId);
      };
      $scope.onClickConvertAssset = (evemt, item) => {
        digitalTwinManagerService.convertAsssetFile(item.nodeId);
      };

      $scope.folderDropCfg = {
        drop: (event) => {
          event.stopPropagation(); // Stops some browsers from redirecting.
          event.preventDefault();
          $scope.dropOnFolder = false;
          digitalTwinManagerService.addFileDropped();
          return false;
        },
        dragover: (event) => {
          event.preventDefault();
          if (!$scope.dropOnFolder) {
            $scope.dropOnFolder = true;
            $scope.$apply();
          }
          closeDropDebounced();
          return false;
        },
        dragenter: (event) => {
          event.preventDefault();
          handleDragEnter();
          return false;
        },
      };
      const handleDragEnter = delayFctGen(() => {
        const filesDropped = digitalTwinManagerService.getFilesDropped();
        if (filesDropped.fileMatch.length > 0) setDropIcon('check', '#19d025');
        else setDropIcon('cancel', 'red');
      }, 100);

      $scope.$watch(
        '$viewContentLoaded',
        function () {
          digitalTwinManagerService.controllerOpenRegister(
            (data) => { // on change
              $scope.filename = data.filename;
              mergeArray(assets, data.assetFiles, (origin, to) => {
                return (
                  origin.nodeId === to.nodeId
                );
              }, (origin, to) => {
                origin.name = to.name;
                origin.nodeId = to.nodeId;
                origin.state = to.state;
                origin.description = to.description;
                origin.versionId = to.versionId;
                origin.date = to.date;
              }, (a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1;
                if (nameA > nameB) return 1;
                return 0; // default return value (no sorting)
              });
              $scope.$apply();
            },
            () => { // on destroy
            });
        });
    }],
};
export default controller;

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
import { FileSystem, Ptr } from "spinal-core-connectorjs";


/**
 * SpinalDrive_App_share
 * @extends {SpinalDrive_App}
 */
class SpinalDrive_App_share extends SpinalDrive_App { }
/**
 * DialogShareCtrl - controller to be added within a `$mdDialog.show` option parameter.
 *  e.g. {controller: ["$scope", "$mdDialog", "model_server_id", "spinalModelDictionary", "mdDialog", "ngSpinalCore",DialogShareCtrl], template: shareTemplate, ... , locals:
 * {model_server_id: obj,spinalModelDictionary: spinalModelDictionary, mdDialog: mdDialog, ngSpinalCore: ngSpinalCore}
 * }
 * @param {any} $scope automaticly given in the mdDialog.show
 * @param {angular} $mdDialog automaticly given in the mdDialog.show
 * @param {number} model_server_id resolved within the `local` object given to the $mdDialog.show(...)
 * @param {angularFactory} spinalModelDictionary same
 * @param {angularFactory} mdDialog same
 * @param {angularFactory} ngSpinalCore same
 */
SpinalDrive_App_share.DialogShareCtrl = function (
  $scope,
  $mdDialog,
  model_server_id,
  spinalModelDictionary,
  mdDialog,
  ngSpinalCore
) {
  spinalModelDictionary.init().then(function () {
    $scope.users = [];
    for (var i = 0; i < spinalModelDictionary.users.length; i++) {
      var user = spinalModelDictionary.users[i];
      $scope.users.push({
        id: user.id.get(),
        name: user.name.get(),
        share_selected: false,
        _lowername: user.name.get().toLowerCase()
      });
    }
    $scope.rightRead = false;
    $scope.rightWrite = false;
    $scope.rightShare = false;
    let mod = FileSystem._objects[model_server_id];
    let _data = 0;
    if (mod instanceof File) _data = mod._ptr.data.value;
    else if (mod instanceof Ptr) _data = mod.data.value;
    else _data = mod._server_id;
  });


  /**
   * Return the proper object when the append is called.
   */
  $scope.transformChip = function (chip) {
    // If it is an object, it's already a known chip
    if (angular.isObject(chip)) {
      return chip;
    }
    // Otherwise, create a new one
    return {
      name: chip,
      type: "new"
    };
  };
  $scope.error_msgs = [];
  $scope.chip_users = [];
  $scope.selectedItem = null;
  $scope.searchText = null;
  function createFilterFor(query) {
    var lowercaseQuery = query.toLowerCase();

    return function filterFn(user) {
      return (
        (user._lowername.indexOf(lowercaseQuery) === 0 ||
          user.id.toString().indexOf(lowercaseQuery) === 0) &&
        $scope.chip_users.some(c => {
          return c.id === user.id;
        }) === false
      );
    };
  }

  $scope.querySearch = query => {
    var results = query
      ? $scope.users.filter(createFilterFor(query))
      : $scope.users.filter(user => {
        return (
          $scope.chip_users.some(c => {
            return c.id === user.id;
          }) === false
        );
      });
    return results;
  };
  $scope.cancelDialog = function () {
    $mdDialog.hide();
  };

  $scope.submitDialog = function () {
    let flag = 0;
    $scope.error_msgs = [];
    if ($scope.rightRead == true) flag |= spinalCore.right_flag.RD;
    if ($scope.rightWrite == true) flag |= spinalCore.right_flag.WR;
    if ($scope.rightShare == true) flag |= spinalCore.right_flag.AD;

    if ($scope.chip_users.length == 0) {
      $scope.error_msgs.push("Add some user(s) to share.");
    }
    if (flag == 0) {
      $scope.error_msgs.push("Please select access rights level.");
    }
    if ($scope.error_msgs.length != 0) {
      return;
    }

    let data = FileSystem._objects[model_server_id];
    let file_name = "";
    if (data.name) file_name = data.name.get();
    else file_name = data.constructor.name + "_" + data._server_id;
    for (var i = 0; i < $scope.chip_users.length; i++) {
      ngSpinalCore.share_model(
        data,
        file_name,
        flag,
        $scope.chip_users[i].name
      );
    }
    $mdDialog.hide();
  };
};

export { SpinalDrive_App_share };
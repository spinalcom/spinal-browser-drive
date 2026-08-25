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

angular.module('app.spinal-panel')
  .run(["$templateCache", "$http", "goldenLayoutService",
    function ($templateCache, $http, goldenLayoutService) {
      let load_template = (uri, name) => {
        $http.get(uri).then((response) => {
          $templateCache.put(name, response.data);
        }, (errorResponse) => {
          console.log('Cannot load the file ' + uri);
        });
      };
      let toload = [{
        uri: 'app/templates/log-panel.html',
        name: 'log-panel.html'
      }];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      goldenLayoutService.registerPanel({
        id: "drag-log-panel",
        name: "Log",
        cfg: {
          isClosable: true,
          title: "Log",
          type: 'component',
          width: 20,
          componentName: 'SpinalHome',
          componentState: {
            template: 'log-panel.html',
            module: 'app.spinal-panel',
            controller: 'LoggerCtrl'
          }
        }
      });
    }
  ])
  .controller('LoggerCtrl', ["spinalFileSystem", "$scope", "$injector", "authService", "$mdToast", "$interval", "$timeout",
    function (spinalFileSystem, $scope, $injector, authService, $mdToast, $interval, $timeout) {
      $scope.injector = $injector;
      $scope.folderDropCfg = {
        "drop": (event) => {
          event.stopPropagation(); // Stops some browsers from redirecting.
          event.preventDefault();
          let selected = spinalFileSystem.FE_selected_drag;
          $scope.loading = true;
          if (selected && selected[0]) { // change to multiple selection later
            $scope.fs_path = Array.from(spinalFileSystem.FE_fspath_drag);
            let serv_id = FileSystem._objects[selected[0]._server_id];
            let logPtr = serv_id._info.log;
            if (logPtr) {
              logPtr.load((log) => {
                let tab = [];
                for (var i = 0; i < log.length; i++) {
                  tab.push({
                    action: log[i].action.get(),
                    date: new Date(log[i].date.get()).toLocaleString(),
                    name: log[i].name.get()
                  });
                }
                $scope.name = selected[0].name;
                $scope.records = tab;
                $scope.loading = false;
                $scope.$apply();
              });
            } else {
              $scope.name = selected[0].name;
              $scope.records = [];
              $scope.loading = false;
            }
          }
          return false;
        },
        "dragover": (event) => {
          event.preventDefault();
          return false;
        },
        "dragenter": (event) => {
          event.preventDefault();
          return false;
        }

      };
    }
  ]);
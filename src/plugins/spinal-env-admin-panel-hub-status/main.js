/*
 * Copyright 2026 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
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

require("./SpinalServerStatusService");
require("./ServerStatusCtrl");
var angular = require("angular");

(function () {
  angular.module("app.spinal-panel").run([
    "$templateCache",
    "$http",
    "goldenLayoutService",
    function ($templateCache, $http, goldenLayoutService) {
      let load_template = (uri, name) => {
        $http.get(uri).then(
          response => {
            $templateCache.put(name, response.data);
          },
          () => {
            console.log("Cannot load the file " + uri);
          }
        );
      };
      let toload = [
        {
          uri:
            "app/templates/hub-status-panel.html",
          name: "hub-status-panel.html"
        }
      ];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      goldenLayoutService.registerPanel({
        id: "drag-hub-status-panel",
        name: "SpinalHub Status",
        cfg: {
          isClosable: true,
          title: "SpinalHub Status",
          type: "component",
          width: 20,
          componentName: "SpinalHome",
          componentState: {
            template: "hub-status-panel.html",
            module: "app.spinal-panel",
            controller: "ServerStatusCtrl"
          }
        }
      });
    }
  ]);
})();

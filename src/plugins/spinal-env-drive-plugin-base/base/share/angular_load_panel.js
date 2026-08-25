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
const angular = require("angular");

angular.module("app.spinal-panel").run([
  "$templateCache",
  "$http",
  function ($templateCache, $http) {
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
          "app/templates/Spinal_App_ShareTemplate.html",
        name: "Spinal_App_ShareTemplate.html"
      }
    ];
    for (var i = 0; i < toload.length; i++) {
      load_template(toload[i].uri, toload[i].name);
    }
  }
]);
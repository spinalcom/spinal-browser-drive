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

var angular = require("angular");

angular.module("app.route", ["ngRoute"]);
angular.module("app.services", []);
angular.module("app.directives", []);
angular.module("app.controllers", ['angularMoment']);
angular.module("app.spinalcom", ["settings", "ngMaterial"]);
angular.module("app.spinal-panel", []);

angular
  .module("SpinalApp", [
    "ngAnimate",
    "ngMaterial",
    "app.directives",
    "app.route",
    "app.sidebar",
    "app.FileExplorer",
    "app.services",
    "app.controllers",
    "ngMdIcons",
    "settings",
    "app.spinalcom",
    "app.spinal-panel"
  ])
  .run([
    "$rootScope",
    "$location",
    "authService",
    function ($rootScope, $location, authService) {
      let user = authService.get_user();
      $rootScope.$on("$routeChangeStart", async function (event, next) {
        try {
          if (next.$$route && next.$$route.authenticate) {
            if (!authService.is_Connected()) {
              await authService.login(user.username, user.password);
            }
          }
        } catch (e) {
          console.error(e);
          $location.path("/login");
        }
      });
    }
  ])

  .config([
    "$mdThemingProvider",
    function ($mdThemingProvider) {
      $mdThemingProvider
        .theme("altTheme")
        .primaryPalette("grey", {
          default: "200"
        })
        .accentPalette("grey", {
          default: "700"
        })
        .dark();
      $mdThemingProvider.theme("default").dark();

      $mdThemingProvider.setDefaultTheme("altTheme");
      $mdThemingProvider.theme("error-toast");
      $mdThemingProvider.alwaysWatchTheme(true);
    }
  ])
  .run([
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
          uri: "app/templates/sideBar.html",
          name: "sideBar.html"
        },
        {
          uri: "app/templates/inspector.html",
          name: "inspector.html"
        },
        {
          uri: "app/templates/FileExplorer.html",
          name: "FileExplorer.html"
        },
        {
          uri: "app/templates/changePasswordModal.html",
          name: "changePasswordModal.html"
        }
      ];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      // $templateCache.put('templateId.html', 'This is the content of the template');
    }
  ]);

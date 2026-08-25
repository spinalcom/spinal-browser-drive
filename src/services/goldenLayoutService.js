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

var angular = require("angular");
var GoldenLayout = require("golden-layout");
var $ = require("jquery");

// import { GoldenLayout } from "golden-layout";
angular
  .module("app.services")
  .factory("goldenLayoutService", [
    "$q",
    "$window",
    "$templateCache",
    "$rootScope",
    "$compile",
    function ($q, $window, $templateCache, $rootScope, $compile) {
      var config = {
        settings: {
          closePopoutsOnUnload: false
        },
        content: [
          {
            type: "row",
            content: [
              {
                isClosable: false,
                title: "Folder Explorer",
                type: "component",
                width: 20,
                componentName: "SpinalHome",
                componentState: {
                  template: "sideBar.html",
                  controller: "sideBarCtrl"
                }
              },
              {
                isClosable: false,
                title: "File Explorer",
                type: "component",
                componentName: "SpinalHome",
                componentState: {
                  template: "FileExplorer.html",
                  controller: "FileExplorerCtrl"
                }
              }
              // {
              //   isClosable: false,
              //   title: "Inspector",
              //   type: 'component',
              //   componentName: 'SpinalHome',
              //   componentState: {
              //     template: 'inspector.html',
              //     controller: 'InspectorCtrl'
              //   }
              // }
            ]
          }
        ]
      };
      const promiseServiceRdy = $q.defer();
      function wait_template(element, state, count = 0) {
        if (count > 50) {
          console.error(
            "Error: imposible to retrive the template : " + state.template
          );
        }
        let template = $templateCache.get(state.template);
        if (template) {
          const elem = $(element);
          elem.html(
            '<div class="gpanel-content" ng-controller="' +
            state.controller +
            '" ng-cloak>' +
            $templateCache.get(state.template) +
            "</div>");
          $compile(elem.contents())($rootScope);
        } else {
          setTimeout(() => {
            wait_template(element, state, ++count);
          }, 100);
        }
      }

      let myLayout = null;
      let factory = {};
      factory.init = () => {
        if (myLayout === null) {
          myLayout = new GoldenLayout(config, $("#g-layout"));

          // GoldenLayout v1 binds unload/beforeunload by default, which can trigger
          // Permissions-Policy warnings in modern browsers. Keep resize binding only.
          if (typeof myLayout._bindEvents === "function") {
            myLayout._bindEvents = function () {
              if (this._isFullPage) {
                $(window).resize(this._resizeFunction);
              }
            };
          }

          factory.myLayout = myLayout;
          myLayout.registerComponent("SpinalHome", function (container, state) {
            var element = container.getElement();
            if (state.template == "") {
              const elem = $(element);
              elem.html("");
              $compile(elem.contents())($rootScope);
            } else {
              wait_template(element, state);
            }
          });

          myLayout.init();
          angular.element($window).bind("resize", function () {
            myLayout.updateSize();
          });
          promiseServiceRdy.resolve();
        }
      };

      factory.wait_ready = () => {
        return promiseServiceRdy.promise;
      };

      factory.createChild = config => {
        myLayout.root.contentItems[0].addChild(config);
      };

      factory.createDragSource = (element, config) => {
        myLayout.createDragSource(element, config);
      };

      factory.panels = [];
      factory.panels_watchers = [];
      factory.registerPanel = panel => {
        factory.panels.push(panel);
        for (var i = 0; i < factory.panels_watchers.length; i++) {
          factory.panels_watchers[i](factory.panels);
        }
      };
      factory.getPanels = () => {
        return factory.panels;
      };
      factory.watch_panel = fn => {
        if (factory.panels_watchers.length === 0) {
          factory.panels_watchers.push(fn);
          if (factory.panels.length != 0) {
            fn(factory.panels);
          }
          return;
        }
        let found = false;
        for (var i = 0; i < factory.panels_watchers.length; i++) {
          if (factory.panels_watchers[i] === fn) {
            found = true;
            break;
          }
        }
        if (found === false) factory.panels_watchers.push(fn);
      };

      return factory;
    }
  ])
  .factory("layout_uid", function () {
    let uid = 0;
    return {
      get: () => {
        let id = uid++;
        return id;
      }
    };
  });

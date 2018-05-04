var angular = require("angular");

angular.module("app.controllers").controller("mainCtrl", [
  "$scope",
  "$routeParams",
  "goldenLayoutService",
  "spinalModelDictionary",
  function($scope, $routeParams, goldenLayoutService) {
    goldenLayoutService.init();
  }
]);

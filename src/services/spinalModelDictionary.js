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

angular.module("app.spinalcom").factory("spinalModelDictionary", [
  "$q",
  "ngSpinalCore",
  "config",
  "authService",
  function ($q, ngSpinalCore, config, authService) {
    let factory = {};
    factory.model = 0;
    factory.users = 0;
    let initPromise = null;
    factory.init = () => {
      if (initPromise !== null) return initPromise;
      initPromise = authService
        .wait_connect()
        .then(async () => {
          // if (factory.users == 0) {
          let user = authService.get_user();
          if (config.mode === "admin") {
            factory.model = await ngSpinalCore.load_root();
          } else {
            factory.model = await ngSpinalCore.load("/__users__/" + user.username);
          }
          factory.users = await ngSpinalCore.load("/etc/users");
          return factory.model;
          // }



          // var deferred = $q.defer();
          // if (factory.users == 0) {
          //   let user = authService.get_user();
          //   ngSpinalCore
          //     .load("/__users__/" + user.username)
          //     .then(m => {
          //       factory.model = m;
          //       return ngSpinalCore.load("/etc/users");
          //     })
          //     .then(u => {
          //       factory.users = u;
          //       deferred.resolve(factory.model);
          //     });
          // }
          // return deferred.promise;
        })
        .catch(() => {
          let user = authService.get_user();
          let msg = "not able to load : " + "/__users__/" + user.username;
          console.error(msg);
          initPromise = null;
          throw (msg);
        });
      return initPromise;
    };
    return factory;
  }
]);

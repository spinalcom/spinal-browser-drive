var angular = require("angular");

angular.module("app.spinalcom").factory("spinalModelDictionary", [
  "$q",
  "ngSpinalCore",
  "config",
  "authService",
  function($q, ngSpinalCore, config, authService) {
    let factory = {};
    factory.model = 0;
    factory.users = 0;
    // factory._end_ = false;
    let wait_init = [];

    function reject(params) {
      for (var i = 0; i < wait_init.length; i++) {
        wait_init[i].reject(params);
      }
    }

    function resolve(params) {
      for (var i = 0; i < wait_init.length; i++) {
        wait_init[i].resolve(params);
      }
    }

    factory.init = () => {
      return authService.wait_connect().then(
        () => {
          var deferred = $q.defer();
          if (factory.users == 0) {
            wait_init.push(deferred);
            if (wait_init.length === 1) {
              let user = authService.get_user();
              // ngSpinalCore.connect("http://" + config.spinalhub_user + ":" + config.spinalhub_pass +
              //   "@" + config.spinalhub_url + ":" + config.spinalhub_port + '/')
              ngSpinalCore
                .load("/__users__/" + user.username)
                .then(
                  m => {
                    factory.model = m;
                    return ngSpinalCore.load("/etc/users");
                    // deferred.resolve(m);
                  },
                  () => {
                    let msg =
                      "not able to load : " + "/__users__/" + user.username;
                    console.error(msg);
                    // deferred.reject(msg);
                    reject(msg);
                  }
                )
                .then(
                  u => {
                    factory.users = u;
                    // factory._end_ = false;
                    // deferred.resolve(factory.model);
                    resolve(factory.model);
                  },
                  () => {
                    let msg = "not able to load : " + "/etc/users";
                    console.error(msg);
                    reject(msg);
                    // deferred.reject(msg);
                  }
                );
            }
          } else deferred.resolve(factory.model);
          return deferred.promise;
        },
        () => {
          let user = authService.get_user();
          let msg = "not able to load : " + "/__users__/" + user.username;
          console.error(msg);
          reject(msg);
          // deferred.reject(msg);
        }
      );
    };
    return factory;
  }
]);

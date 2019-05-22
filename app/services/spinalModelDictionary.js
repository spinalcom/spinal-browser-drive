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
    let initPromise = null;
    factory.init = () => {
      if (initPromise !== null) return initPromise;
      initPromise = authService
        .wait_connect()
        .then(() => {
          var deferred = $q.defer();
          if (factory.users == 0) {
            let user = authService.get_user();
            ngSpinalCore
              .load("/__users__/" + user.username)
              .then(m => {
                factory.model = m;
                return ngSpinalCore.load("/etc/users");
              })
              .then(u => {
                factory.users = u;
                deferred.resolve(factory.model);
              });
          }
          return deferred.promise;
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

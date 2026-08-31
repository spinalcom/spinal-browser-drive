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

angular.module("app.spinalcom").factory("authService", [
  "$q",
  "ngSpinalCore",
  "config",
  "$http",
  function ($q, ngSpinalCore, config, $http) {
    let factory = {};
    let user = {
      username: "",
      password: ""
    };
    factory.hub_version = null;
    factory.isHubVersionAtLeast = (major, minor, patch) => {
      if (!factory.hub_version) return false;
      const v = factory.hub_version;
      if (v.major > major) return true;
      if (v.major < major) return false;
      if (v.minor > minor) return true;
      if (v.minor < minor) return false;
      return (v.patch || 0) >= (patch || 0);
    };
    let is_Connected = false;
    factory.save_user = (username, password) => {
      user.username = username;
      user.password = password;
      window.localStorage.setItem("spinalhome_cfg", btoa(JSON.stringify(user)));
    };
    factory.get_user = () => {
      let _user = window.localStorage.getItem("spinalhome_cfg");
      if (_user) {
        user = JSON.parse(atob(_user));
      }
      return user;
    };
    factory.logout = () => {
      if (user.username != "") {
        factory.save_user("", "");
        location.reload();
      }
    };

    factory.login = (username, password) => {
      if (config.mode === "admin") {
        return adminLogin(username, password);
      } else {
        return userLogin(username, password);
      }
    };

    factory.is_Connected = () => {
      return is_Connected;
    };
    let wait_connect_defer = null;
    factory.wait_connect = () => {
      if (wait_connect_defer) return wait_connect_defer.promise;
      wait_connect_defer = $q.defer();
      if (is_Connected == true) {
        wait_connect_defer.resolve();
      }
      // else wait_connectList.push(deferred);
      return wait_connect_defer.promise;
    };

    async function adminLogin(username, password) {
      try {
        const u = await isUserAdmin(username, password);
        if (u) {
          ngSpinalCore.connect(
            "http://" +
            u +
            ":" +
            password +
            "@" +
            config.spinalhub_url +
            ":" +
            config.spinalhub_port +
            "/"
          );
          factory.save_user(username, password);
          is_Connected = true;
          if (wait_connect_defer) { wait_connect_defer.resolve(); }
        }
      } catch (e) {
        try {
          const u = await isUser(username, password);
          if (u) {
            throw new Error("Administrator privileges are required to run this application.");
          }
        } catch (err) {
          throw err;
        }
      }
    }

    async function userLogin(username, password) {
      try {
        const u = await isUser(username, password);
        if (u) {
          ngSpinalCore.connect(
            "http://" +
            u +
            ":" +
            password +
            "@" +
            config.spinalhub_url +
            ":" +
            config.spinalhub_port +
            "/"
          );
          factory.save_user(username, password);
          is_Connected = true;
          if (wait_connect_defer) { wait_connect_defer.resolve(); }
        }
      } catch (e) {
        throw e;
      }
    }

    function getHubVersionFromHeaders(data) {
      try {
        const hub_version = data.headers("powerby");
        // hub_version is null or for example 'SpinalHub v4.1.0'
        factory.hub_version = null;
        if (hub_version) {
          const match = /v(\d+)\.(\d+)\.(\d+)/i.exec(hub_version);
          if (match) {
            factory.hub_version = {
              major: parseInt(match[1], 10),
              minor: parseInt(match[2], 10),
              patch: parseInt(match[3], 10)
            };
          }
        }
      } catch (e) {
        console.error("Error parsing hub version from headers:", e);
      }
    }


    async function isUserAdmin(username, password) {
      let url = "/get_admin_id";
      try {
        const data = await $http.get(url + "?u=" + username + "&p=" + password);
        getHubVersionFromHeaders(data);

        var u = parseInt(data.data);
        if (u == -1) {
          let msg = "Login Error: username / password pair not found.";
          throw new Error(msg);
        }
        return u;
      } catch (e) {
        throw e;
      }
    }

    async function isUser(username, password) {
      let url = "/get_user_id";
      try {
        const data = await $http.get(url + "?u=" + username + "&p=" + password);
        getHubVersionFromHeaders(data);
        var u = parseInt(data.data);
        if (u == -1) {
          let msg = "Login Error: username / password pair not found.";
          throw new Error(msg);
        }
        return u;
      } catch (e) {
        throw e;
      }
    }


    return factory;
  }
]);

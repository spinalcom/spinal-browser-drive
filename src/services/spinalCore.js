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
import { spinalCore, FileSystem, File, Ptr, getUrlPath } from "spinal-core-connectorjs";

angular.module("app.spinalcom").factory("ngSpinalCore", [
  "$q",
  function ($q) {
    var service = {};
    /** @type {FileSystem} */
    service.conn = null;
    const mapModelDictionary = new Map();

    service.connect = function (option) {
      service.conn = spinalCore.connect(option);
    };
    service.store = function (model, path) {
      return spinalCore.store(service.conn, model, path);
    };
    service.load = function (path) {
      return spinalCore.load(service.conn, path);
    };
    service.load_type = function (modelName, callback_success, callback_error) {
      spinalCore.load_type(
        service.conn,
        modelName,
        function (model) {
          callback_success(model);
        },
        function () {
          callback_error();
        }
      );
    };
    service.load_right = function (ptr) {
      return spinalCore.load_right(
        service.conn,
        ptr
      );
    };
    service.share_model = function (data, filename, flag, target_username) {
      return spinalCore.share_model(
        service.conn,
        data,
        filename,
        flag,
        target_username
      );
    };
    service.load_root = function () {
      return service.conn.load_or_make_dir("/");
    };
    service.loadModelPtr = function loadModelPtr(model) {
      if (model instanceof File) {
        return loadModelPtr(model._ptr);
      }
      if (!(model instanceof Ptr)) {
        throw new Error("loadModelPtr must take Ptr as parameter");
      }
      if (!model.data.value && model.data.model) {
        return Promise.resolve(model.data.model);
      } else if (!model.data.value) {
        throw new Error("Trying to load a Ptr to 0");
      }

      if (mapModelDictionary.has(model.data.value)) {
        return mapModelDictionary.get(model.data.value);
      }
      if (typeof FileSystem._objects[model.data.value] !== "undefined") {
        const promise = Promise.resolve(FileSystem._objects[model.data.value]);
        mapModelDictionary.set(model.data.value, promise);
        return promise;
      }
      const promise = new Promise((resolve, reject) => {
        model.load(m => {
          if (!m) {
            mapModelDictionary.delete(model.data.value);
            reject(new Error("Error in load Ptr"));
          } else {
            resolve(m);
          }
        });
      });
      mapModelDictionary.set(model.data.value, promise);
      return promise;
    };

    service.change_password = async function (username, password, new_password) {
      let url_path = '';
      if (FileSystem.CONNECTOR_TYPE === 'Node' || FileSystem.is_cordova) {
        url_path = `${a._protocol}//${a._url}`;
        if (a._port) url_path += `:${a._port}/get_change_user_password`;
      } else {
        url_path = `/get_change_user_password`;
      }
      url_path = `${url_path}?e=${username}&op=${password}&np=${new_password}`;
      try {
        const data = await service.conn._axiosInst(url_path);
        return data.data;
      } catch (error) {
        console.error(error);
        throw "Error changing password";
      }
    };


    return service;
  }
]);

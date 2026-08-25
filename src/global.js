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

import $ from "jquery";
window.$ = window.jQuery = globalThis.$ = globalThis.jQuery = $;
require("jstree");

if (typeof $.trim !== "function") {
  $.trim = function (value) {
    if (value == null) return "";
    return String(value).trim();
  };
}

import * as angular from "angular";
globalThis.angular = angular;
window.angular = globalThis.angular;

window.setImmediate = (cb) => {
  return window.setTimeout(cb, 0);
};

import { FileSystem } from "spinal-core-connectorjs";
FileSystem.CONNECTOR_TYPE = "Browser";
/*
 * Copyright 2018 SpinalCom - www.spinalcom.com
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
var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var module_path = path.resolve(__dirname);
let test_is_in_node_modules = /node_modules/g.exec(module_path);
if (test_is_in_node_modules === null) {
  process.exit(0);
}
var rootPath = path.resolve("../..");
var ln = path.resolve(module_path + "/icons");
var browserPath = path.resolve(rootPath + "/.browser_organs");
var icons = path.resolve(browserPath + "/icons");

function cb(err) {
  if (err) { console.error(err); }
  else {
    if (!fs.existsSync(icons)) {
      fs.symlinkSync(
        path.relative(browserPath, ln),
        icons
      );
    }
  }
}

try {
  const prom = mkdirp(browserPath, cb);
  if (prom) {
    prom.then(cb)
  }
} catch (e) {
  mkdirp(browserPath).then(cb);
} 

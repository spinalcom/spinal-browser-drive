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

import "./global.js";

import "angular-material/angular-material.css";
import "material-design-icons/iconfont/material-icons.css";
import "golden-layout/src/css/goldenlayout-base.css";
import "golden-layout/src/css/goldenlayout-dark-theme.css";
import "jstree/dist/themes/default-dark/style.min.css";
import "font-awesome/css/font-awesome.css";
import "angular-material-data-table/dist/md-data-table.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "d3-context-menu/css/d3-context-menu.css";
import "./css/vendor/spectrum.css";
import "./css/app.css";

import "angular-aria";
import "angular-animate";
import "angular-material";
import "angular-route";
import "bootstrap";
import "angular-material-icons";
import "angular-material-data-table";
import "jquery-ui";
import "d3";
import "angular-moment";
import "spinal-env-drive-core";

require("./app.js");
require("./app.config.admin.js");
require("./app.route.js");
require("./directives/navbar.js");
require("./directives/dnd-fileExplorer.js");
require("./directives/spinalInspect.js");
require("./services/spinalCore.js");
require("./services/spinalModelDictionary.js");
require("./services/spinalFilesystem.js");
require("./services/spinalFolderExplorerService.js");
require("./services/goldenLayoutService.js");
require("./services/authService.js");
require("./controllers/sideBarCtrl.js");
require("./controllers/mainCtrl.js");
require("./controllers/FileExplorerCtrl.js");
require("./controllers/navbarCtrl.js");
require("./controllers/InspectorCtrl.js");
require("./controllers/loginCtrl.js");
require("./plugins/loadPluginsAdmin.js");
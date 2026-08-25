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

import "spinal-env-drive-core";
const spinalDrive_Env = window.spinalDrive_Env;

import {
  SpinalDrive_App_FileExplorer_delete,
  SpinalDrive_App_FolderExplorer_delete,
  SpinalDrive_App_FileExplorer_currdir_delete
} from "./base/SpinalDrive_App_delete";
import { InspectorEdit } from "./base/SpinalDrive_App_edit_dbinspect";
import {
  FileExplorerCurrDirNewFolder,
  FolderExplorerNewFolder
} from "./base/SpinalDrive_App_newFolder";
import { FileExplorerRename } from "./base/SpinalDrive_App_renameFile";
import {
  FileExplorerShare,
  FolderExplorerShare,
  InspectorShare
} from "./base/share/index";
import { FileExplorerDownload } from "./base/SpinalDrive_App_download";

spinalDrive_Env.add_applications(
  "FileExplorer",
  new SpinalDrive_App_FileExplorer_delete()
);
spinalDrive_Env.add_applications(
  "FileExplorerCurrDir",
  new SpinalDrive_App_FileExplorer_currdir_delete()
);
spinalDrive_Env.add_applications(
  "FolderExplorer",
  new SpinalDrive_App_FolderExplorer_delete()
);
spinalDrive_Env.add_applications(
  "Inspector",
  new InspectorEdit()
);
spinalDrive_Env.add_applications(
  "FolderExplorer",
  new FolderExplorerNewFolder()
);
spinalDrive_Env.add_applications(
  "FileExplorerCurrDir",
  new FileExplorerCurrDirNewFolder()
);
spinalDrive_Env.add_applications(
  "FileExplorer",
  new FileExplorerRename()
);
spinalDrive_Env.add_applications(
  "FileExplorer",
  new FileExplorerShare()
);
spinalDrive_Env.add_applications(
  "FolderExplorer",
  new FolderExplorerShare()
);
spinalDrive_Env.add_applications(
  "Inspector",
  new InspectorShare()
);
spinalDrive_Env.add_applications(
  "FileExplorer",
  new FileExplorerDownload()
);

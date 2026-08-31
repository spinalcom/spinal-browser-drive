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

import { RoleLst } from './Models/RoleLst';
import { Role } from './Models/Role';
import { UserProfile } from './Models/UserProfile';
import { AppProfileLst } from './Models/AppProfileLst';
import { AppProfile } from './Models/AppProfile';

import { Directory, Ptr, File } from 'spinal-core-connectorjs';
import { loadModelPtr } from './loadModelPtr';
const CONFIG_PATH = '/etc/config/';
const USERS_FILE_PATH = '/etc/users';
const USERS_PROFILE_DIR_NAME = 'UserProfileDir';
const ROLE_LST_PATH = `${CONFIG_PATH}UserProfileLst`;
const APP_PROFILE_LST_PATH = `${CONFIG_PATH}AppProfileLst`;
const ADMIN_NAME = 'Admin';
const ADMIN_DESCRIPTION = 'Administrator of the spinal platform';
const INTEGRATOR_NAME = 'Intégrateur';
const INTEGRATOR_DESCRIPTION = 'Intégrateur description';
const MAINTAINER_NAME = 'Mainteneur';
const MAINTAINER_DESCRIPTION = 'Mainteneur description';
const ASSET_MANAGER_NAME = 'Asset Manager';
const DEFAULT_USER_NAME = 'Basic Utilisateur';
const DEFAULT_USER_DESCRIPTION = 'Defaut utilisateur description';

const USERS_DIR = '__users__';
const PUBLIC_DIR = 'public';

const USERS = [
  { name: ADMIN_NAME, description: ADMIN_DESCRIPTION },
  { name: INTEGRATOR_NAME, description: INTEGRATOR_DESCRIPTION },
  { name: MAINTAINER_NAME, description: MAINTAINER_DESCRIPTION },
  { name: ASSET_MANAGER_NAME, description: ASSET_MANAGER_NAME },
  { name: DEFAULT_USER_NAME, description: DEFAULT_USER_DESCRIPTION },
];

export class SpinalAdminInit {
  static wait() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  static async init(authService: any, ngSpinalCore: any): Promise<void> {
    await authService.wait_connect();
    await SpinalAdminInit.wait();
    await SpinalAdminInit.initRoleLst(ngSpinalCore);
    await SpinalAdminInit.initAppProfileLst(ngSpinalCore);
    await SpinalAdminInit.initDefaultUser(ngSpinalCore);
    await SpinalAdminInit.initPublicDir(ngSpinalCore);
  }
  static async initRoleLst(ngSpinalCore: any): Promise<void> {
    try {
      await ngSpinalCore.load(ROLE_LST_PATH);
    } catch (error) {
      await SpinalAdminInit.onRoleLstLoadFail(ngSpinalCore);
    }
  }

  static async initAppProfileLst(ngSpinalCore: any): Promise<void> {
    try {
      await ngSpinalCore.load(APP_PROFILE_LST_PATH);
    } catch (error) {
      await SpinalAdminInit.onAppProfileLstLoadFail(ngSpinalCore);
    }
  }

  static async initPublicDir(ngSpinalCore: any): Promise<void> {
    const usersDir = await ngSpinalCore.load(USERS_DIR);
    return SpinalAdminInit.onInitPublicDir(usersDir);
  }

  static getFileTargetServerId(file: File): number {
    const ptr = file._ptr;
    if (ptr.data.value) return ptr.data.value;
    return ptr.data.model._server_id;
  }

  static getOrCreatePublicDir(userDir: Directory) {
    const file = userDir.detect((x) => x.name.get() === PUBLIC_DIR);
    if (!file) {
      // file doesn't exist
      const dir = new Directory();
      userDir.add_file(PUBLIC_DIR, dir);
      return Promise.resolve(dir);
    }
    return loadModelPtr(file);
  }

  static async onInitPublicDir(userDir: Directory): Promise<void> {
    const publicDir = await SpinalAdminInit.getOrCreatePublicDir(userDir);
    for (let i = 0; i < userDir.length; i++) {
      if (
        userDir[i].name.get() !== PUBLIC_DIR &&
        userDir[i]._info &&
        !userDir[i]._info.publicDir
      ) {
        userDir[i]._info.add_attr('publicDir', new Ptr(publicDir));
      }
    }
  }

  static async onRoleLstLoadFail(ngSpinalCore: any): Promise<void> {
    const userProfileLst: RoleLst = new RoleLst();
    for (let i = 0; i < USERS.length; i++) {
      const user = USERS[i];
      //start id = 1
      userProfileLst.users.push(new Role(i, user.name, user.description));
    }
    try {
      await ngSpinalCore.store(userProfileLst, ROLE_LST_PATH);
    } catch (error) {
      console.log('store rejection from onRoleLstLoadFail');
    }
  }

  static async onAppProfileLstLoadFail(ngSpinalCore: any): Promise<void> {
    const appProfileLst: AppProfileLst = new AppProfileLst();
    for (let i = 0; i < 32; i++) {
      appProfileLst.apps.push(
        new AppProfile(i + 1, 'id des profile utilisateur en binaire inverser')
      );
    }
    try {
      await ngSpinalCore.store(appProfileLst, APP_PROFILE_LST_PATH);
    } catch (error) {
      console.log('store rejection from onAppProfileLstLoadFail');
    }
  }

  static async getUserProfileDir(ngSpinalCore: any): Promise<Directory<File>> {
    const etcDir: Directory<File> = await ngSpinalCore.load('/etc');
    for (const file of etcDir) {
      if (file.name.get() === USERS_PROFILE_DIR_NAME) return file.load();
    }
    const newDir: Directory<File> = new Directory();
    etcDir.add_file(USERS_PROFILE_DIR_NAME, newDir);
    return newDir;
  }

  static async initDefaultUser(ngSpinalCore: any): Promise<void> {
    const dir = await SpinalAdminInit.getUserProfileDir(ngSpinalCore);
    const users: Directory<File<UserProfile>> =
      await ngSpinalCore.load(USERS_FILE_PATH);
    for (const user of users) {
      if (!dir.has(user.name.get())) {
        //4 is the id of default user role. 0 is admin role
        console.log('initDefaultUser', user.name.get(), user);
        const type = user.type?.get() == 0 ? 0 : 4;
        const userProfile: UserProfile = new UserProfile([type]);
        dir.add_file(user.name.get(), userProfile);
      }
    }
  }
}

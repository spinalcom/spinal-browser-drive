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

const BIM_FILE_CONTEXT_NAME = 'BimFileContext';
const BIM_FILE_RELATION = 'hasBimFile';
const BIM_FILE_TYPE = 'BimFile';
import {
  FileVersionModel,
  FileVersionContainerModel,
} from 'spinal-model-file_version_model';

import ProcessOnChange from '../utils/ProcessOnChange';
import { Str, Model } from 'spinal-core-connectorjs_type';
import {
  SpinalGraphService,
  SpinalNode,
  SPINAL_RELATION_TYPE,
  SpinalNodePointer,
} from 'spinal-env-viewer-graph-service';
import loadModelPtr from '../utils/loadModelPtr';

interface SpinalNodeRef extends spinal.Model {
  childrenIds: string[];
  contextIds: string[];
  element: SpinalNodePointer<spinal.Model>;
  hasChildren: boolean;
  [key: string]: any;
}
export type AssetFile = {
  nodeId: string;
  name: string;
  FileVersionModel: FileVersionModel;
};

export default class BimFileService {
  processOnChange!: ProcessOnChange;
  constructor(fct?: () => void) {
    if (fct) {
      this.setOnChange(fct);
    }
  }
  resetProcess() {
    this.processOnChange.empty();
  }

  setOnChange(fct: () => void) {
    this.processOnChange = new ProcessOnChange(fct, {
      type: 'throttle',
      timeout: 200,
    });

  }
  addToProces(node: string | spinal.Str | SpinalNode<any> | SpinalNodeRef, check = true): void {
    if (check === false) {
      // @ts-ignore
      return this.processOnChange.add(node);
    }
    let resNode = node;
    if (typeof node === 'string' || node instanceof String) {
      resNode = SpinalGraphService.getRealNode(node.toString());
    }
    if (node instanceof Str) {
      const id = node.get();
      const realNode = SpinalGraphService.getRealNode(id);
      return this.processOnChange.add(realNode);
    }
    if (resNode instanceof Model) {
      if (typeof resNode.id !== 'undefined') {
        return this.processOnChange.add(SpinalGraphService.getRealNode(resNode.id.get()));
      }
    }
    // @ts-ignore
    this.processOnChange.add(resNode);
  }

  async getContextID(): Promise<string> {
    let context: SpinalNode<any> = SpinalGraphService.getContext(BIM_FILE_CONTEXT_NAME);
    if (!context) {
      context = await SpinalGraphService.addContext(BIM_FILE_CONTEXT_NAME);
    }
    this.addToProces(context, false);
    return context.getId().get();
  }
  async getAssetFiles(): Promise<AssetFile[]> {
    const contextId = await this.getContextID();
    const children = await SpinalGraphService.getChildren(contextId, [BIM_FILE_RELATION]);
    return Promise.all(children.map(async (child) => {
      this.addToProces(child);
      const versionModel = await loadModelPtr(child.element.ptr);
      const currentVersion: FileVersionModel = await loadModelPtr(versionModel.currentVersion);
      // @ts-ignore
      this.addToProces(currentVersion);
      return {
        nodeId: child.id.get(),
        name: child.name.get(),
        FileVersionModel: currentVersion,
      };
    }));
  }

  async removeAssetFile(nodeID: string) {
    const contextId = await this.getContextID();
    const children = await SpinalGraphService.getChildren(contextId, [BIM_FILE_RELATION]);

    // test if current version exist in context children
    for (const child of children) {
      // if true retrun
      if (child.type && child.type.get() === BIM_FILE_TYPE &&
        child.id && child.id.get() === nodeID) {
        return SpinalGraphService.removeFromGraph(nodeID);
      }
    }
  }
  async setState(node, state) {
    const versionModel = await loadModelPtr(node.element.ptr);
    const currentVersion: FileVersionModel = await loadModelPtr(versionModel.currentVersion);
    if (typeof currentVersion.state === 'undefined') {
      currentVersion.mod_attr('state', state);
    }
    currentVersion.state.set(state);
  }

  async convertAsssetFile(nodeID: string) {
    const contextId = await this.getContextID();
    const children = await SpinalGraphService.getChildren(contextId, [BIM_FILE_RELATION]);

    // test if current version exist in context children
    for (const child of children) {
      // if true retrun
      if (child.type && child.type.get() === BIM_FILE_TYPE &&
        child.id && child.id.get() === nodeID) {
        return this.setState(child, 1);
      }
    }
  }

  async addAssetFile(file: spinal.File<any>): Promise<void> {
    const versionModel = await FileVersionContainerModel.getVersionModelFromFile(file);
    const contextId = await this.getContextID();
    const children = await SpinalGraphService.getChildren(contextId, [BIM_FILE_RELATION]);

    // test if current version exist in context children
    for (const child of children) {
      // if true retrun
      if (child.type && child.type.get() === BIM_FILE_TYPE &&
        child.name && child.name.get() === file.name.get()) {
        return;
      }
    }

    // if false push currentversionModel
    const info = {
      type: BIM_FILE_TYPE,
      name: file.name.get(),
    };
    const node = SpinalGraphService.createNode(info, versionModel);
    SpinalGraphService.addChildInContext(contextId, node, contextId,
      BIM_FILE_RELATION, SPINAL_RELATION_TYPE);
  }

}

export {
  BimFileService,
  BIM_FILE_CONTEXT_NAME,
  BIM_FILE_RELATION,
  BIM_FILE_TYPE,
};

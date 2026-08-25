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

export const knownExt = [
  '3DM',
  '3DS',
  'ASM',
  'CATPART',
  'CATPRODUCT',
  'CGR',
  'COLLABORATION',
  'DAE',
  'DGN',
  'DLV3',
  'DWF',
  'DWFX',
  'DWG',
  'DWT',
  'DXF',
  'EMODE',
  'EXP',
  'F2D',
  'F3D',
  'FBX',
  'G',
  'GBXML',
  'GLB',
  'GLTF',
  'IAM',
  'IDW',
  'IFC',
  'IGE',
  'IGES',
  'IGS',
  'IPT',
  'IWM',
  'JT',
  'MAX',
  'MODEL',
  'NEU',
  'NWC',
  'NWD',
  'OBJ',
  'PDF',
  'PMLPRJ',
  'PMLPRJZ',
  'PRT',
  'PSMODEL',
  'RCP',
  'RVT',
  'SAB',
  'SAT',
  'SESSION',
  'SKP',
  'SLDASM',
  'SLDPRT',
  'STE',
  'STEP',
  'STL',
  'STLA',
  'STLB',
  'STP',
  'STPZ',
  'WIRE',
  'X_B',
  'X_T',
  'XAS',
  'XPR',
  'ZIP',
  'SVF.ZIP',
];

const mapRegExp: Map<string, RegExp> = new Map();
function init() {
  if (mapRegExp.size === 0) {
    for (let idxExt = 0; idxExt < knownExt.length; idxExt++) {
      const ext = knownExt[idxExt];
      mapRegExp.set(ext, new RegExp(`.+\.${ext}$`, 'i'));
    }
  }
}

export default function matchKnownExt(filename: string): boolean {
  init();
  for (const exp of mapRegExp.values()) {
    if (exp.test(filename) === true) return true;
  }
  return false;
}

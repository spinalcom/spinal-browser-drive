// Copyright 2026 SpinalCom - www.spinalcom.com
// Accès unique à spinal-core-connectorjs (01-architecture §3). Le connecteur garde un état global :
// une seule connexion par onglet. Il est chargé à la demande (il pèse lourd et n'a rien à faire sur la page de connexion).
import type * as Connecteur from 'spinal-core-connectorjs';

type Mod = typeof Connecteur;
let mod: Promise<Mod> | null = null;

// Le connecteur appelle setImmediate (API Node) dans load_ptr : équivalent navigateur.
const g = globalThis as unknown as { setImmediate?: (f: (...a: unknown[]) => void, ...a: unknown[]) => unknown };
g.setImmediate ??= (f, ...a) => setTimeout(() => f(...a), 0);

export function connecteur(): Promise<Mod> {
  // CommonJS : Vite le convertit ; l'export par défaut porte les classes.
  mod ??= import('spinal-core-connectorjs').then((m) => ((m as unknown as { default?: Mod }).default ?? m) as Mod);
  return mod;
}

/** Modèle spinalcore minimal tel que l'interface le manipule (types volontairement lâches : le connecteur est dynamique). */
export interface Modele {
  _server_id: number;
  _attribute_names: string[];
  constructor: { name: string };
  get(): unknown;
  set(v: unknown): boolean;
  bind(f: () => void, onchange_construction?: boolean): unknown;
  unbind(p: unknown): void;
  add_attr(o: Record<string, unknown>): void;
  rem_attr(name: string): void;
  [k: string]: any;
}

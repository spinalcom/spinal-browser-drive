// Copyright 2026 SpinalCom - www.spinalcom.com
import type { Component, Snippet } from 'svelte';

export type IconeComposant = Component<{ size?: number | string; strokeWidth?: number | string; class?: string }>;
export type Ton = 'neutre' | 'accent' | 'ok' | 'warn' | 'danger' | 'info';
export type Taille = 'sm' | 'md' | 'lg';

/** États normalisés (02-ux §6). */
export type Etat = 'attente' | 'cours' | 'termine' | 'reserves' | 'erreur' | 'annule' | 'arrete' | 'sans-reponse' | 'envoyee';

export interface Option<V = string> {
  value: V;
  label: string;
  icone?: IconeComposant;
  description?: string;
  desactive?: boolean;
}

/** Élément de menu (Menu, ContextMenu, Toolbar « Plus »). */
export type ElementMenu =
  | { type?: 'action'; id: string; label: string; icone?: IconeComposant; raccourci?: string; danger?: boolean; desactive?: boolean; raison?: string; executer: () => void }
  | { type: 'separateur' }
  | { type: 'titre'; label: string }
  | { type: 'sous-menu'; label: string; icone?: IconeComposant; elements: ElementMenu[] };

/** Groupes d'actions dans l'ordre fixe de 02-ux §5. */
export type GroupeAction = 'creer' | 'modifier' | 'relier' | 'voir' | 'exporter' | 'retirer' | 'supprimer';
export const ORDRE_GROUPES: GroupeAction[] = ['creer', 'modifier', 'relier', 'voir', 'exporter', 'retirer', 'supprimer'];

export interface Action {
  id: string;
  label: string;
  icone?: IconeComposant;
  groupe: GroupeAction;
  principale?: boolean;
  desactive?: boolean;
  raison?: string;
  raccourci?: string;
  executer: () => void;
}

/** Tâche du plateau (01-architecture §7). */
export interface Tache {
  id: string;
  titre: string;
  contexte?: string;
  etat: Etat;
  icone?: IconeComposant;
  progression?: number;
  etapes?: { nom: string; etat: 'fait' | 'cours' | 'attente' | 'erreur' }[];
  detail?: string;
  duree?: string;
  resultats?: { ok: number; ignores?: { nom: string; raison: string }[]; erreurs?: { nom: string; raison: string }[] };
  annuler?: () => void;
  relancer?: () => void;
}

/** Colonne de DataTable. */
export interface Colonne<T> {
  id: string; label: string; largeur?: number; min?: number; align?: 'gauche' | 'droite';
  valeur?: (t: T) => Valeur; /** Texte affiché (sinon la valeur brute) ; le tri reste sur valeur. */ texte?: (t: T) => string; cellule?: Snippet<[T]>; triable?: boolean; masquee?: boolean; mono?: boolean;
}

export type Valeur = string | number | boolean | Date | null | undefined;

/** Commande de la palette (Ctrl K). */
export interface Commande { id: string; label: string; section: string; icone?: IconeComposant; raccourci?: string; detail?: string; motsCles?: string; executer: () => void }

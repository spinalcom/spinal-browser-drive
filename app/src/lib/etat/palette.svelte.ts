// Copyright 2026 SpinalCom - www.spinalcom.com
// Palette de commandes partagée : chaque écran y déclare ses commandes (actions, dossiers, fichiers).
import type { Commande } from '$lib/ui/types';

export const palette = $state<{ ouvert: boolean; commandes: Commande[]; recents: string[] }>({ ouvert: false, commandes: [], recents: [] });

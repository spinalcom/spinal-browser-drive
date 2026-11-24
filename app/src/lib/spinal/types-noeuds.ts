// Copyright 2026 SpinalCom - www.spinalcom.com
// Jeu fixe d'icônes et de libellés métier par type de nœud (05-design-system §2.4, 02-ux §2.5).
// Un type inconnu retombe sur une icône générique, avec son nom brut en infobulle.
import type { IconeComposant } from '$lib/ui/types';
import Network from '@lucide/svelte/icons/network';
import MapPin from '@lucide/svelte/icons/map-pin';
import Building from '@lucide/svelte/icons/building';
import Layers from '@lucide/svelte/icons/layers';
import SquareDashed from '@lucide/svelte/icons/square-dashed';
import DoorOpen from '@lucide/svelte/icons/door-open';
import Cpu from '@lucide/svelte/icons/cpu';
import Box from '@lucide/svelte/icons/box';
import FolderTree from '@lucide/svelte/icons/folder-tree';
import LayoutGrid from '@lucide/svelte/icons/layout-grid';
import Tags from '@lucide/svelte/icons/tags';
import Server from '@lucide/svelte/icons/server';
import Router from '@lucide/svelte/icons/router';
import Radio from '@lucide/svelte/icons/radio';
import Gauge from '@lucide/svelte/icons/gauge';
import Ticket from '@lucide/svelte/icons/ticket';
import Calendar from '@lucide/svelte/icons/calendar';
import StickyNote from '@lucide/svelte/icons/sticky-note';
import FileText from '@lucide/svelte/icons/file-text';
import ChartLine from '@lucide/svelte/icons/chart-line';
import Clapperboard from '@lucide/svelte/icons/clapperboard';
import FileBox from '@lucide/svelte/icons/file-box';
import Boxes from '@lucide/svelte/icons/boxes';
import Folder from '@lucide/svelte/icons/folder';
import Workflow from '@lucide/svelte/icons/workflow';
import Shapes from '@lucide/svelte/icons/shapes';

export interface TypeNoeud { label: string; icone: IconeComposant }

export const TYPES: Record<string, TypeNoeud> = {
  geographicContext: { label: 'Contexte spatial', icone: Network },
  geographicSite: { label: 'Site', icone: MapPin },
  geographicBuilding: { label: 'Bâtiment', icone: Building },
  building: { label: 'Bâtiment', icone: Building },
  geographicFloor: { label: 'Étage', icone: Layers },
  geographicZone: { label: 'Zone', icone: SquareDashed },
  geographicRoom: { label: 'Pièce', icone: DoorOpen },
  BIMObject: { label: 'Équipement', icone: Cpu },
  geographicReference: { label: 'Référence 3D', icone: Box },
  groupingCategory: { label: 'Catégorie', icone: FolderTree },
  roomsGroup: { label: 'Groupe de pièces', icone: LayoutGrid },
  equipmentGroup: { label: 'Groupe d’équipements', icone: LayoutGrid },
  endpointGroup: { label: 'Groupe de points', icone: LayoutGrid },
  categoryAttributes: { label: 'Catégorie d’attributs', icone: Tags },
  BmsNetwork: { label: 'Réseau', icone: Server },
  BmsDevice: { label: 'Automate', icone: Router },
  BmsEndpoint: { label: 'Point de mesure', icone: Radio },
  SpinalControlPoint: { label: 'Point de contrôle', icone: Gauge },
  SpinalSystemServiceTicketTypeTicket: { label: 'Ticket', icone: Ticket },
  SpinalServiceTicketProcess: { label: 'Processus', icone: Workflow },
  SpinalEvent: { label: 'Événement', icone: Calendar },
  SpinalNote: { label: 'Note', icone: StickyNote },
  document: { label: 'Document', icone: FileText },
  analytic: { label: 'Analyse', icone: ChartLine },
  scene: { label: 'Scène', icone: Clapperboard },
  maquette: { label: 'Maquette', icone: FileBox },
  jumeau: { label: 'Jumeau', icone: Boxes },
  dossier: { label: 'Dossier', icone: Folder },
};

export function typeNoeud(type: string): TypeNoeud & { connu: boolean } {
  const t = TYPES[type];
  return t ? { ...t, connu: true } : { label: type, icone: Shapes, connu: false };
}

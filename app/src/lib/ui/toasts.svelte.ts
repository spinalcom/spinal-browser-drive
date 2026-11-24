// Copyright 2026 SpinalCom - www.spinalcom.com
// File des notifications (05-design-system §3.5 Toast) : 3 au plus, 5 s, 8 s avec action, persistantes pour les erreurs.
export type GenreToast = 'succes' | 'info' | 'erreur';
export interface Toast {
  id: number;
  genre: GenreToast;
  message: string;
  action?: { label: string; executer: () => void };
}

let suivant = 1;
const minuteries = new Map<number, ReturnType<typeof setTimeout>>();
export const toasts = $state<Toast[]>([]);

export function fermerToast(id: number) {
  const i = toasts.findIndex((t) => t.id === id);
  if (i >= 0) toasts.splice(i, 1);
  clearTimeout(minuteries.get(id));
  minuteries.delete(id);
}

export function notifier(message: string, genre: GenreToast = 'succes', action?: Toast['action']): number {
  const id = suivant++;
  toasts.push({ id, genre, message, action });
  while (toasts.length > 3) fermerToast(toasts[0].id);
  if (genre !== 'erreur') minuteries.set(id, setTimeout(() => fermerToast(id), action ? 8000 : 5000));
  return id;
}

// Copyright 2026 SpinalCom - www.spinalcom.com
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Hub cible en développement : même routes que le serveur `web` (browser/http/index.js).
// Par défaut le hub de démonstration (copie de base, scripts/hub-demo.sh), jamais la pile de dev.
const HUB = process.env.HUB_URL ?? 'http://127.0.0.1:17600';
const ROUTES_HUB = ['/sceen', '/get_user_id', '/get_admin_id', '/get_new_account', '/get_change_user_password'];

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: '127.0.0.1', port: 5175, strictPort: true,
    proxy: Object.fromEntries(ROUTES_HUB.map((r) => [r, { target: HUB, changeOrigin: true }])),
  },
  preview: { host: '127.0.0.1', proxy: Object.fromEntries(ROUTES_HUB.map((r) => [r, { target: HUB, changeOrigin: true }])) },
  optimizeDeps: { include: ['spinal-core-connectorjs'] },
  build: { commonjsOptions: { include: [/spinal-core-connectorjs/, /node_modules/] } },
});

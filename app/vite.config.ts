// Copyright 2026 SpinalCom - www.spinalcom.com
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: { port: 5175, strictPort: true },
});

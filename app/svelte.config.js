// Copyright 2026 SpinalCom - www.spinalcom.com
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  compilerOptions: { runes: true },
  kit: {
    adapter: adapter({ fallback: 'index.html' }),
    paths: { base: '/studio' },
    alias: { $ui: 'src/lib/ui' },
  },
};

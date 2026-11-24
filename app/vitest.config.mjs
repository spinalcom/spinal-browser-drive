// Copyright 2026 SpinalCom - www.spinalcom.com
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    pool: 'forks',                 // un processus par fichier : connectorjs n'a qu'un FileSystem global
    maxWorkers: 4,
    testTimeout: 120000,
    hookTimeout: 180000,
    include: ['tests/**/*.test.{js,mjs,ts}'],
  },
});

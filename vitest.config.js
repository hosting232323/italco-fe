import { defineConfig, mergeConfig } from 'vitest/config';

import viteConfig from './vite.config';


// Riusa alias e plugin di vite (compreso vuetify) cosi' i test vedono i moduli
// esattamente come l'app.
export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    maxWorkers: 1,
    environment: 'jsdom',
    include: ['tests/**/*.spec.js'],
    setupFiles: ['tests/setup.js'],
    server: {
      // generic-module importa componenti vuetify con i loro .css: senza
      // inline vite non li trasforma e node non sa che farsene.
      deps: { inline: ['generic-module', 'vuetify'] }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'cobertura'],
      include: ['src/**/*.{js,vue}'],
      exclude: [
        'src/main.js',
        'src/plugins/**',
        // Sola configurazione del client http di generic-module: i test lo
        // sostituiscono sempre con un mock.
        'src/utils/http.js'
      ],
      // Le soglie valgono sui livelli che la suite copre davvero.
      thresholds: {
        'src/{stores,utils}/**': { statements: 90, branches: 90, functions: 90, lines: 90 }
      }
    }
  }
}));

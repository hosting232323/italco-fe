import vuePlugin from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["*.js", "*.vue"],

    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module"
    },

    plugins: {
      vue: vuePlugin
    },

    extends: [
      "eslint:recommended",
      "plugin:vue/vue3-recommended"
    ],

    rules: {
      quotes: ["error", "single"],        // virgolette singole
      semi: ["error", "always"],          // punti e virgola obbligatori
      indent: ["error", 2],               // indent JS 2 spazi
      "vue/html-indent": ["error", 2],    // indent template Vue 2 spazi
      "no-console": "warn"                // warning per console.log
    }
  }
]);
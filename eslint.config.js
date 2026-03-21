import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import vueScopedCss from 'eslint-plugin-vue-scoped-css';

export default [
  js.configs.recommended,

  ...pluginVue.configs['flat/recommended'],
  ...vueScopedCss.configs['flat/recommended'],

  {
    files: ['**/*.{js,vue}'],

    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    plugins: {
      'vue-scoped-css': vueScopedCss
    },

    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      indent: ['error', 2],
      'vue/html-indent': ['error', 2],
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'eol-last': ['error', 'always'],
      'vue/no-v-html': 'off',
      'vue-scoped-css/no-unused-selector': 'warn',
      'vue-scoped-css/no-unused-keyframes': 'warn'
    }
  }
];

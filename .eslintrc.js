module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'vue/html-indent': ['error', 2],
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'eol-last': ['error', 'always']
  },
};

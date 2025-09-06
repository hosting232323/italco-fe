module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended', // o vue2 se usi Vue 2
  ],
  rules: {
    quotes: ['error', 'single'], // obbliga le virgolette singole
    semi: ['error', 'always'],   // obbliga il punto e virgola
    indent: ['error', 2],        // rientro di 2 spazi
    'vue/html-indent': ['error', 2], // rientro HTML nei template Vue
    'no-console': 'warn',        // console.log segnalato come warning
    'no-unused-vars': 'warn',    // segnala variabili non usate
  },
};

/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
  overrides: [
    {
      files: ['src/**/*.vue', 'src/**/*.js'],
      rules: {
        'no-unused-vars': 'off', // warn
        'vue/multi-word-component-names': 'off', // warn
      },
    },
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
};

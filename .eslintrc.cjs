/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-typescript', '@vue/eslint-config-prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    overrides: [
        {
            files: ['src/' + '**' + '/' + '*.vue', 'src/' + '**' + '/' + '*.ts'],
            rules: {
                'no-unused-vars': 'off', // warn
                'vue/multi-word-component-names': 'off', // warn
                '@typescript-eslint/no-unused-vars': 'off',
            },
        },
    ],
};
/*
module.exports = {
  env: { node: true },
  extends: [
    'eslint:recommended', // this maybe causes errors in defineEmits<{}>() ???
    'plugin:vue/vue3-recommended',
    //'plugin:vue/vue3-strongly-recommended ',
    'plugin:@typescript-eslint/recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier'
  ],
//   globals: {
//    defineEmits: 'readonly',
//    defineProps: 'readonly',
//  },
    parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: false,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  // plugins: ['@typescript-eslint'], // might not be needed
  // rules: {
  //  '@typescript-eslint/explicit-function-return-type': 'warn',
  //},

  root: true,
  overrides: [
    {
      files: ['src/'+'**'+'/'+'*.vue', 'src/'+'**'+'/'+'*.js'],
      rules: {
        'no-unused-vars': 'off', // warn
        'vue/multi-word-component-names': 'off', // warn
      },
    },
  ],
};
*/

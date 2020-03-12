'use strict';

module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  env: {
    jest: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    reportUnusedDisableDirectives: true,
    'import/resolver': {
      'babel-module': {},
      node: {
        moduleDirectory: ['node_modules', './src'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
        ],
      },
    },
  },
  rules: {
    'no-plusplus': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'linebreak-style': 0,
    'prefer-const': 1,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-array-index-key': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'jest'],
};

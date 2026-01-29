'use strict';

const { defineConfig, globalIgnores } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const ember = require('eslint-plugin-ember');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      parserOptions: {},

      globals: {
        ...globals.browser,
      },
    },

    plugins: {
      ember,
      '@typescript-eslint': typescriptEslint,
    },

    extends: compat.extends(
      'eslint:recommended',
      'plugin:ember/recommended',
      'plugin:prettier/recommended',
    ),

    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['**/*.ts'],

    extends: compat.extends(
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    ),

    rules: {},
  },
  {
    files: [
      './.eslintrc.js',
      './.prettierrc.js',
      './.stylelintrc.js',
      './.template-lintrc.js',
      './ember-cli-build.js',
      './testem.js',
      './blueprints/*/index.js',
      './config/**/*.js',
      './lib/*/index.js',
      './server/**/*.js',
      './babel.config.cjs',
    ],

    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, 'off']),
        ),
        ...globals.node,
      },
    },

    extends: compat.extends('plugin:n/recommended'),
  },
  {
    files: ['./eslint.config.js'],

    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key]) => [key, 'off']),
        ),
        ...globals.node,
      },
    },
  },
  {
    files: ['tests/**/*-test.{js,ts}'],
    extends: compat.extends('plugin:qunit/recommended'),
  },
  globalIgnores([
    'blueprints/*/files/',
    'dist/',
    'coverage/',
    '!**/.*',
    '**/.*/',
    '.node_modules.ember-try/',
  ]),
]);

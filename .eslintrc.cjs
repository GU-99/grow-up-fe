const vitest = require('eslint-plugin-vitest');

module.exports = {
  root: true,
  env: { browser: true, node: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:testing-library/react',
    'plugin:vitest/recommended',
    'prettier',
  ],
  plugins: ['react-refresh', 'react', 'react-hooks', '@typescript-eslint', 'jest-dom', 'testing-library', 'vitest'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'object-curly-newline': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-shadow': 'warn',
    'no-param-reassign': 'warn',
    'no-return-assign': 'warn',
    'no-unused-vars': 'warn',
    'no-cond-assign': 'off',
    'no-plusplus': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/no-array-index-key': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'warn',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'vitest/valid-title': 'off',
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        labelAttributes: ['htmlFor'],
      },
    ],
  },
  ignorePatterns: [
    'dist',
    'build',
    'node_modules',
    'public',
    '.history',
    '.eslintrc.cjs',
    'yarn.lock',
    'postcss.config.js',
    'tailwind.config.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  globals: {
    ...vitest.environments.env.globals,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.eslintrc.cjs',
      '.prettierrc',
      '.gitignore',
      'tailwind.config.js',
      'vite.config.ts',
      'node_modules/**',
    ],
  },
  // JavaScript/TypeScript 기본 설정
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      prettier: prettier,
    },
    rules: {
      // ESLint 기본 규칙
      'no-var': 'error',
      eqeqeq: 'error',
      'no-extra-semi': 'error',
      'no-unused-vars': 'off',
      'no-console': 'off',
      'no-debugger': 'off',
      'no-nested-ternary': 'off',
      'linebreak-style': 'off',
      'no-use-before-define': 'off',
      'no-shadow': 'off',
      'operator-linebreak': 'off',
      quotes: ['warn', 'single'],
      'no-alert': 'off',
      'no-param-reassign': 'off',

      // TypeScript 규칙
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/array-type': ['warn', { default: 'generic' }],
      '@typescript-eslint/type-annotation-spacing': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',

      // React 규칙
      'react/prop-types': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/prefer-stateless-function': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-pascal-case': 'warn',
      'react/jsx-key': 'warn',
      'react/function-component-definition': [
        'warn',
        { namedComponents: ['arrow-function', 'function-declaration'] },
      ],
      'react/jsx-tag-spacing': 'warn',
      'react/button-has-type': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'react/require-default-props': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/no-unstable-nested-components': 'off',

      // React Hooks 규칙
      ...reactHooks.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'off',

      // React Refresh 규칙
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Import 규칙
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-absolute-path': 'off',

      // Accessibility 규칙
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',

      // 코드 스타일 규칙
      'arrow-parens': ['warn', 'as-needed'],
      'comma-dangle': ['warn', 'always-multiline'],
      'comma-spacing': ['warn', { after: true }],
      'eol-last': 'warn',
      camelcase: 'warn',
      'implicit-arrow-linebreak': 'off',

      // Prettier 규칙
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
  // Prettier와의 충돌 방지를 위해 마지막에 적용
  prettierConfig,
);

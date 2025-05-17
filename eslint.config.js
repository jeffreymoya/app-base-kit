import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      '**/dist/',
      '**/node_modules/',
      '**/.yarn/',
      '**/cdktf.out/',
      'packages/infrastructure/.gen/**',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: ['./tsconfig.base.json', './packages/*/tsconfig.json'],
      },
    },
  },
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended, // This must be last to override other formatting rules
  {
    rules: {
      // 'prettier/prettier': 'error', // Already handled by eslintPluginPrettierRecommended
      '@typescript-eslint/no-explicit-any': 'warn',
      // Add any other custom rules here
    },
  },
);

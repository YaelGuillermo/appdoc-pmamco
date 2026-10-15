import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'pnpm-lock.yaml'] },
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
];

// Astro-generated TypeScript declarations
export const astroGeneratedDeclarations = {
  files: ['src/env.d.ts'],
  rules: {
    '@typescript-eslint/triple-slash-reference': 'off',
  },
};

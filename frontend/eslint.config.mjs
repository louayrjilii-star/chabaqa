import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...nextCoreWebVitals,
  globalIgnores(['.next/**', '.next-dev/**', 'node_modules/**', 'coverage/**']),
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
      'import/no-anonymous-default-export': 'off',
      // These React Compiler checks are not yet enabled project-wide. Keep the
      // established Next rules while migration is tracked separately.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/incompatible-library': 'off',
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['@/__fixtures__/*', '**/__fixtures__/*'],
          message: 'Test fixtures must not be imported from production app or component code.',
        }],
      }],
    },
  },
  {
    files: ['**/__tests__/**/*', '**/*.test.ts', '**/*.test.tsx', 'jest.setup.js'],
    rules: { 'no-restricted-imports': 'off' },
  },
])

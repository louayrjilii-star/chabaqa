module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  // The frontend is an independent package with its own Jest configuration.
  testPathIgnorePatterns: [
    '/node_modules/', '/.next/', '/frontend/',
    // These tests belong to the frontend package and import its API modules.
    '/__tests__/notifications.test.tsx$',
    '/__tests__/moderator-dashboard.test.tsx$',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/(admin)/**/*.{ts,tsx}',
    'lib/api/admin-api.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
};

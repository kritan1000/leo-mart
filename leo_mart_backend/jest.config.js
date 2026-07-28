/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^uuid$': '<rootDir>/src/__tests__/__mocks__/uuid.js',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/app.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**',
    '!src/seed.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  testTimeout: 30000,
};

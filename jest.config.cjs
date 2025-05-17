module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/packages'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/packages/core/src/$1',
    '^@cli/(.*)$': '<rootDir>/packages/cli/src/$1',
    '^@mobile-sdk/(.*)$': '<rootDir>/packages/mobile-sdk/src/$1',
    '^@embed-script/(.*)$': '<rootDir>/packages/embed-script/src/$1',
    '^@infrastructure/(.*)$': '<rootDir>/packages/infrastructure/src/$1',
    '^@server/(.*)$': '<rootDir>/packages/server/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.base.json',
      },
    ],
  },
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!packages/**/src/**/*.d.ts',
    '!packages/**/src/**/__tests__/**',
    '!packages/**/src/**/index.ts', // Often just re-exports
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
};

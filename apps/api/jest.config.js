/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  moduleNameMapper: {
    '^@itvara/db$': '<rootDir>/../../packages/db/index.ts',
    '^@itvara/utils$': '<rootDir>/../../packages/utils/index.ts',
    '^@itvara/types$': '<rootDir>/../../packages/types/index.ts',
    '^@itvara/config$': '<rootDir>/../../packages/config/index.ts'
  }
};

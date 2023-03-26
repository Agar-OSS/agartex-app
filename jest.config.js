const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig')

module.exports = {
  collectCoverage: false,
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    '^[^!].*\\.(css|less|png)$': 'identity-obj-proxy',
    ...pathsToModuleNameMapper(compilerOptions.paths)
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

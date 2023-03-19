module.exports = {
  collectCoverage: false,
  moduleNameMapper: {
    '^[^!].*\\.(css|less)$': 'identity-obj-proxy'
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

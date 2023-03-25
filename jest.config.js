module.exports = {
  collectCoverage: false,
  moduleNameMapper: {
    '^[^!].*\\.(css|less|png)$': 'identity-obj-proxy',
  },
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

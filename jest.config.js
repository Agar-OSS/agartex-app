module.exports = {
  collectCoverage: false,
  moduleNameMapper: {
    '^[^!].*\\.(css|less)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
};

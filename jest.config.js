module.exports = {
  setupFiles: ['<rootDir>/tests/setup.js'],
  setupTestFrameworkScriptFile: '<rootDir>/tests/setup-framework.js',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
};

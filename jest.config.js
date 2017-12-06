const jestConfig = require('frans-scripts/jest');

jestConfig.setupFiles = jestConfig.setupFiles || [];
jestConfig.setupFiles.push('<rootDir>/tests/setup.js');

jestConfig.coverageThreshold = {
  global: {
    branches: 30,
    functions: 30,
    lines: 30,
    statements: 30,
  },
};

module.exports = jestConfig;

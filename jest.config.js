const jestConfig = require('frans-scripts/jest');

jestConfig.setupFiles = jestConfig.setupFiles || [];
jestConfig.setupFiles.push('<rootDir>/tests/setup.js');

module.exports = jestConfig;

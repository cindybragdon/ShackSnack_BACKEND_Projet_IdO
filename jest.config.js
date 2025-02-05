export default {
    testEnvironment: 'node',
    transform: {
      '^.+\\.js$': 'babel-jest',        // Use Babel to transform JS files
    },
    moduleFileExtensions: ['js', 'json'],
    coverageDirectory: 'coverage',
    coverageReporters: ['html', 'text'],
    collectCoverageFrom: [
      'src/**/*.js',
      '!src/**/*.test.js',
      '!src/**/*.spec.js'
    ],
  };
  
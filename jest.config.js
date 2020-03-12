'use strict';

module.exports = {
  modulePaths: ['<rootDir>/src'],
  setupFiles: ['./jest.setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx',
  ],
  "moduleNameMapper": {
    "\\.(jpe?g|png|gif|ico|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};

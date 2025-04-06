/** @type {import('jest').Config} */
const path = require('path')

const config = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1"
  },
  transformIgnorePatterns: ["node_modules/(?!react-native|@react-native|expo|@expo|expo-modules-core|expo-asset)"],
  setupFilesAfterEnv: [path.join(__dirname, 'setup-testing.js')],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  /*transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  moduleNameMapper: {
    '^react-native$': 'react-native',
    '^@react-navigation/(.*)$': '<rootDir>/node_modules/@react-navigation/$1',
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  globals: {
    __DEV__: true
  }*/
 
}

module.exports = config

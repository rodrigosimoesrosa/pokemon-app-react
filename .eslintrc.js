// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:testing-library/react', 'plugin:jest-dom/recommended'],
  ignorePatterns: ['/dist/*'],
  /* for lint-staged */
  globals: {
    __dirname: true
  },
  rules: {
    'no-console': 'error'
  },
  plugins: ['jest', 'testing-library']
};

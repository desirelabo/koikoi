export default {
  testEnvironment: 'jsdom',
  transform: {
    "^.+\.js$": "babel-jest",
  },
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)"
  ],
};
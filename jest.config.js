module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/", "/out/", "/src/test"],
  transform: { "^.+\\.ts$": "<rootDir>/jest.preprocess.js" },
};

const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  roots: ['<rootDir>'],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  collectCoverage: true, 
  coverageDirectory: "coverage",
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
module.exports = {
  moduleFileExtensions: ["js", "ts", "vue"],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".*\\.vue$": "vue-jest",
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^tests/(.*)$": "<rootDir>/tests/$1",
  },
};

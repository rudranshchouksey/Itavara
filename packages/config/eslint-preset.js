module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  env: {
    node: true,
    es2022: true,
    browser: true
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {},
  ignorePatterns: ["dist", ".eslintrc.js", "node_modules"]
};

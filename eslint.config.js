const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      globals: {
        ...globals.mocha,
        ...globals.node,
      },
    },
    rules: {
      "radix": "error",
      "eqeqeq": "error",
      "no-eval": "error",
      "no-with": "error",
      "no-console": "off",
      "no-unused-vars": "warn",
      "yoda": ["error", "never"],
      "strict": ["error", "global"],
      "quotes": ["error", "single"],
    },
  },
];

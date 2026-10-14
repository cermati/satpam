/**
 * Runs shared parity fixtures (../../test-fixtures/*.json) through the JS satpam build in ../../lib.
 * Used by record-fixtures.js (to write `expected`) and test/fixtures-parity.spec.js (to check it).
 * The Java FixtureParityTest reads the same files and must produce the same results.
 *
 * Fixture file shape:
 * {
 *   "description": "...",
 *   "groups": [{
 *     "name": "minLength",
 *     "options": { "locale": "id", "messages": { "required": "..." } },   // optional
 *     "rules": { "name": ["minLength:3"] },
 *     "cases": [{ "input": { "name": "ab" }, "expected": { "success": false, "messages": {...} } }]
 *   }]
 * }
 * A case whose validation throws has `"expectedError": "<JS error message>"` instead of `expected`.
 * A case without an `input` key validates `undefined`.
 */
const fs = require('fs');
const path = require('path');
const satpam = require('../../lib');

const FIXTURES_DIR = path.resolve(__dirname, '../../test-fixtures');

const fixtureFiles = () => fs.readdirSync(FIXTURES_DIR)
  .filter(file => file.endsWith('.json') && file !== 'rule-names.json')
  .sort()
  .map(file => path.join(FIXTURES_DIR, file));

const createValidator = (options = {}) => {
  const validator = satpam.create();

  if (options.locale) {
    validator.setValidationLocale(options.locale);
  }

  Object.keys(options.messages || {}).forEach(ruleName => {
    validator.setValidationMessage(ruleName, options.messages[ruleName]);
  });

  return validator;
};

/**
 * @returns {{expected: Object}|{expectedError: String}}
 */
const runCase = (group, testCase) => {
  const validator = createValidator(group.options);

  try {
    const result = validator.validate(group.rules, testCase.input);

    // Drop the ValidationMessage prototype so results compare as plain JSON
    return { expected: JSON.parse(JSON.stringify(result)) };
  } catch (error) {
    return { expectedError: error.message };
  }
};

module.exports = { FIXTURES_DIR, fixtureFiles, runCase };

#!/usr/bin/env node
/**
 * Records the expected result of every parity fixture by running it through JS satpam, which is
 * the source of truth. Run from the satpam repo root after `npm run compile`:
 *
 *   node java/scripts/record-fixtures.js
 *
 * Seeds can use two shorthands that are expanded into plain `cases` (and removed):
 * - "inputs": [ {...}, ... ]      one case per input object
 * - "probe": "x"                 one case per STANDARD_VALUES entry as { x: value }, plus a case
 *                                where x is missing; covers JS truthiness/coercion edge cases
 *
 * It also writes test-fixtures/rule-names.json, the fullNames of all built-in JS rules, which the
 * Java RuleCoverageTest uses to detect rules that are not ported.
 */
const fs = require('fs');
const path = require('path');
const satpam = require('../../lib');
const { FIXTURES_DIR, fixtureFiles, runCase } = require('./fixture-runner');

const STANDARD_VALUES = [
  null, '', ' ', '  \t\n', 'abc', 'ABC', 'aBc 12', 'a1', '123', '0', '007', '12.5', '-3', '+4', '.5', '5.',
  '1e3', '0x1F', '0b101', 'Infinity', 'NaN', ' 42 ', 'true', 'abc@def', 'Ünïcödé',
  0, 1, -1, 12.5, -0.5, 1e21, 123456789,
  true, false,
  [], [''], ['a'], ['a', 'b'], [1, 2], ['abc', 'xyz'], [null],
  {}, { a: 1 }
];

const expandCases = group => {
  const cases = group.cases || [];

  (group.inputs || []).forEach(input => cases.push({ input }));

  if (group.probe) {
    cases.push({ input: {} });
    STANDARD_VALUES.forEach(value => cases.push({ input: { [group.probe]: value } }));
  }

  delete group.inputs;
  delete group.probe;
  group.cases = cases;
};

let total = 0;

fixtureFiles().forEach(file => {
  const fixture = JSON.parse(fs.readFileSync(file, 'utf8'));

  fixture.groups.forEach(group => {
    expandCases(group);

    group.cases = group.cases.map(testCase => {
      const { expected, expectedError, ...rest } = testCase; // eslint-disable-line no-unused-vars
      total += 1;

      return { ...rest, ...runCase(group, rest) };
    });
  });

  fs.writeFileSync(file, JSON.stringify(fixture, null, 2) + '\n');
  console.log(`recorded ${path.relative(process.cwd(), file)}`);
});

const ruleNames = Object.keys(satpam.validation).sort();
fs.writeFileSync(path.join(FIXTURES_DIR, 'rule-names.json'), JSON.stringify(ruleNames, null, 2) + '\n');

console.log(`${total} cases, ${ruleNames.length} rule names`);

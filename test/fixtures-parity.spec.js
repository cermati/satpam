import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { fixtureFiles, runCase } from '../java/scripts/fixture-runner';

/**
 * The JS half of the JS/Java parity check: the recorded fixtures must still match what JS satpam
 * produces. The Java half is java/satpam-core/src/test/java/com/cermati/satpam/FixtureParityTest.java.
 * Re-record with `node java/scripts/record-fixtures.js` after an intended behaviour change.
 */
describe('Shared JS/Java parity fixtures', () => {
  fixtureFiles().forEach(file => {
    const fixture = JSON.parse(fs.readFileSync(file, 'utf8'));

    describe(path.basename(file), () => {
      fixture.groups.forEach(group => {
        group.cases.forEach((testCase, index) => {
          it(`${group.name} #${index} ${JSON.stringify(testCase.input)}`, () => {
            const actual = runCase(group, testCase);

            if ('expectedError' in testCase) {
              expect(actual.expectedError).to.equal(testCase.expectedError);
            } else {
              expect(actual.expected).to.deep.equal(testCase.expected);
            }
          });
        });
      });
    });
  });
});

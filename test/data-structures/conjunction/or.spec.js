import {expect} from 'chai';
import conjunction from '../../../src/data-structures/conjunction';

describe('`Or` Conjunction', () => {
  describe('.satisfied()', () => {
    context('when the conjunction is not nested', () => {
      context('and only has 1 mapping', () => {
        const or = new conjunction.Or({name: 'wut'});

        it('should be satisfied', () => {
          const result = or.satisfied({name: 'wut'});

          expect(result).to.be.true;
        });

        it('should not be satisfied', () => {
          const result = or.satisfied({name: 'wat'});

          expect(result).to.be.false;
        });
      });

      context('and has multiple mappings', () => {
        const or = new conjunction.Or({
          tywin: 'lannister',
          day: 'light',
          game: 'of thrones'
        });

        it('should be satisfied with 1 matched input', () => {
          const result = or.satisfied({day: 'light'});

          expect(result).to.be.true;
        });

        it('should not be satisfied when all of the inputs are not matched', () => {
          const result = or.satisfied({
            tywin: 'lanniser',
            day: 'liht',
            game: 'of-thrones'
          });

          expect(result).to.be.false;
        });
      });

      context('and the given mappings value is an array', () => {
        const or = new conjunction.Or({name: ['hi', 'there']});

        it('should be satisfied when one of the value is matched', () => {
          const result = or.satisfied({name: 'there'});

          expect(result).to.be.true;
        });

        it('should not be satisfied', () => {
          const result = or.satisfied({name: 'wat'});

          expect(result).to.be.false;
        });
      });
    });

    context('when the conjunction is nested 1 level', () => {
      context('and the nested `Or` conjunction has only 1 possible', () => {
        context('which the nested mapping has different mapping key with its parent', () => {
          const or = new conjunction.Or({
            name: {
              type: 'or',
              mappings: {
                ye: 'ha'
              }
            }
          });

          it('should be satisfied', () => {
            const result = or.satisfied({name: 'sss', ye: 'ha'});

            expect(result).to.be.true;
          });

          it('should not be satisfied', () => {
            const result = or.satisfied({name: 'zzz', ye: 'h'});

            expect(result).to.be.false;
          });
        });

        context('which the nested mapping has the same mapping key with its parent', () => {
          const or = new conjunction.Or({
            name: {
              type: 'or',
              mappings: {
                name: 'wut'
              }
            }
          });

          it('should be satisfied', () => {
            const result = or.satisfied({name: 'wut'});

            expect(result).to.be.true;
          });

          it('should not be satisfied', () => {
            const result = or.satisfied({name: 'wat'});

            expect(result).to.be.false;
          });
        });
      });

      context('and the nested `Or` conjunction has 2 possible values', () => {
        context('which the nested mapping has different mapping key with its parent', () => {
          const or = new conjunction.Or({
            name: {
              type: 'or',
              mappings: {
                ye: 'ha',
                lannister: 'approves'
              }
            }
          });

          it('should be satisfied when one of the inner mappings is satisfied', () => {
            const result = or.satisfied({lannister: 'approves'});

            expect(result).to.be.true;
          });

          it('should not be satisfied when none of the inner mappings is satisfied', () => {
            const result = or.satisfied({lannister: 'approve'});

            expect(result).to.be.false;
          });
        });

        context('which the nested mapping has the same mapping key with its parent', () => {
          const or = new conjunction.Or({
            name: {
              type: 'or',
              mappings: {
                name: 'wut'
              }
            }
          });

          it('should be satisfied', () => {
            const result = or.satisfied({
              name: 'wut'
            });

            expect(result).to.be.true;
          });

          it('should not be satisfied', () => {
            const result = or.satisfied({
              name: 'wat'
            });

            expect(result).to.be.false;
          });
        });

        context('which the mapping value is an array', () => {
          const or = new conjunction.Or({
            name: {
              type: 'or',
              mappings: {
                ye: ['sabo', 'teur'],
                lannister: 'approves'
              }
            }
          });

          it('should be satisfied when one of the inner mappings is satisfied', () => {
            const result = or.satisfied({ye: 'teur'});

            expect(result).to.be.true;
          });

          it('should not be satisfied when none of the inner mappings is satisfied', () => {
            const result = or.satisfied({lannister: 'approve'});

            expect(result).to.be.false;
          });
        });
      });
    });
  });
});

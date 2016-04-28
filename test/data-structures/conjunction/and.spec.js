import {expect} from 'chai';
import conjunction from '../../../lib/data-structures/conjunction';

describe('`And` Conjunction', () => {
  describe('.satisfied()', () => {
    context('when the conjunction is not nested', () => {
      context('and only has 1 mapping', () => {
        const and = new conjunction.And({name: 'wut'});

        it('should be satisfied', () => {
          const result = and.satisfied({name: 'wut'});

          expect(result).to.be.true;
        });

        it('should not be satisfied', () => {
          const result = and.satisfied({name: 'wat'});

          expect(result).to.be.false;
        });
      });

      context('and has multiple mappings', () => {
        const and = new conjunction.And({
          tywin: 'lannister',
          day: 'light',
          game: 'of thrones'
        });

        it('should only be satisfied when all of the inputs match', () => {
          const result = and.satisfied({
            tywin: 'lannister',
            day: 'light',
            game: 'of thrones'
          });

          expect(result).to.be.true;
        });

        it('should not be satisfied when one of the inputs does not match', () => {
          const result = and.satisfied({
            game: 'of-thrones'
          });

          expect(result).to.be.false;
        });
      });

      context('and one of the given mappings value is an array', () => {
        const and = new conjunction.And({
          name: ['hi', 'there'],
          yi: 'pee!'
        });

        it('should be satisfied when all of the inputs match', () => {
          const result = and.satisfied({
            name: 'there',
            yi: 'pee!'
          });

          expect(result).to.be.true;
        });

        it('should not be satisfied when one the input does not match', () => {
          const result = and.satisfied({
            name: 'thera',
            yi: 'pee!'
          });

          expect(result).to.be.false;
        });
      });
    });

    context('when the conjunction is nested 1 level', () => {
      context('and the nested `And` conjunction has only 1 value', () => {
        context('which the nested mapping has different mapping key with its parent', () => {
          const and = new conjunction.And({
            name: {
              type: 'and',
              mappings: {
                ye: 'ha'
              }
            }
          });

          it('should be satisfied', () => {
            const result = and.satisfied({name: 'sss', ye: 'ha'});

            expect(result).to.be.true;
          });

          it('should not be satisfied', () => {
            const result = and.satisfied({name: 'zzz', ye: 'h'});

            expect(result).to.be.false;
          });
        });

        context('which the nested mapping has the same mapping key with its parent', () => {
          const and = new conjunction.And({
            name: {
              type: 'and',
              mappings: {
                name: 'wut'
              }
            }
          });

          it('should be satisfied', () => {
            const result = and.satisfied({name: 'wut'});

            expect(result).to.be.true;
          });

          it('should not be satisfied', () => {
            const result = and.satisfied({name: 'wat'});

            expect(result).to.be.false;
          });
        });
      });

      context('and the nested `And` conjunction has 2 possible values', () => {
        context('which the nested mapping has different mapping key with its parent', () => {
          const and = new conjunction.And({
            name: {
              type: 'and',
              mappings: {
                ye: 'ha',
                lannister: 'approves'
              }
            }
          });

          it('should be satisfied when all of the inputs match', () => {
            const result = and.satisfied({
              ye: 'ha',
              lannister: 'approves'
            });

            expect(result).to.be.true;
          });

          it('should not be satisfied when one of input does not match the inner mappings', () => {
            const result = and.satisfied({ye: 'h', lannister: 'approves'});

            expect(result).to.be.false;
          });
        });

        context('which the nested mapping has the same mapping key with its parent', () => {
          const and = new conjunction.And({
            name: {
              type: 'and',
              mappings: {
                name: 'wut',
                ice: 'cream'
              }
            }
          });

          it('should only be satisfied when all of the inputs match', () => {
            const result = and.satisfied({
              name: 'wut',
              ice: 'cream'
            });

            expect(result).to.be.true;
          });

          it('should not be satisfied when one of the input does not match the inner mappings', () => {
            const result = and.satisfied({
              name: 'wut',
              ice: 'sandwich'
            });

            expect(result).to.be.false;
          });
        });

        context('which the mapping value is an array', () => {
          const and = new conjunction.And({
            name: {
              type: 'and',
              mappings: {
                ye: ['sabo', 'teur'],
                lannister: 'approves'
              }
            }
          });

          it('should only be satisfied when all of the inputs match', () => {
            const result = and.satisfied({
              ye: 'teur',
              lannister: 'approves'
            });

            expect(result).to.be.true;
          });

          it('should not be satisfied when one of the input does not match the inner mappings', () => {
            const result = and.satisfied({
              ye: 'teu',
              lannister: 'approves'
            });

            expect(result).to.be.false;
          });
        });
      });
    });
  });
});

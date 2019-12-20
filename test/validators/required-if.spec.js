import noes from 'noes';
import { expect } from 'chai';
import validator from '../../lib';

describe('Required if validator', () => {
  context('with validator wrapper', () => {
    context('when given normal parameters', () => {
      const simpleRules = {
        address: ['requiredIf:hasHome:Yes']
      };

      it('should success if hasHome equals to Yes', () => {
        const result = validator.validate(simpleRules, {
          hasHome: 'Yes',
          address: 'somewhere over the rainbow'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('address');
      });

      it('should success if hasHome is undefined', () => {
        const result = validator.validate(simpleRules, {});
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('address');
      });

      it('should fail', () => {
        const input = {hasHome: 'Yes'};
        const result = validator.validate(simpleRules, input);
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('address');
        expect(err.address['requiredIf:$1:$2']).to.equal('Address field is required.');
      });
    });

    context('when given `Or` structure as parameter', () => {
      context('and it\'s an `Or` instance', () => {
        const or = new noes.Or({
          hasHome: 'yes',
          hasApartment: 'yo'
        });

        testWithOr(or);
      });

      context('and it\'s an object with type equals to or', () => {
        const or = {
          type: 'or',
          mappings: {
            hasHome: 'yes',
            hasApartment: 'yo'
          }
        };

        testWithOr(or);
      });
    });

    context('when given `And` structure as parameter', () => {
      context('and it\'s an `And` instance', () => {
        const and = new noes.And({
          hasHome: 'yes',
          hasApartment: 'yo'
        });

        testWithAnd(and);
      });

      context('and it\'s an object with type equals to and', () => {
        const and = {
          type: 'and',
          mappings: {
            hasHome: 'yes',
            hasApartment: 'yo'
          }
        };

        testWithAnd(and);
      });
    });
  });
});

function testWithAnd(and) {
  const rules = {
    address: [{
      fullName: 'requiredIf:$1:$2',
      params: [and]
    }]
  };

  context('with satisfied parameter', () => {
    it('should success with valid input', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        hasApartment: 'yo',
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should fail with invalid input', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        hasApartment: 'yo'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.address).to.have.property('requiredIf:$1:$2')
        .that.equals('Address field is required.');
    });
  });

  context('with unsatisfied parameter', () => {
    it('should success with different input dependency value', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        hasApartment: 'yoo'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should success with empty input', () => {
      const result = validator.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });
  });
}

function testWithOr(or) {
  const rules = {
    address: [{
      fullName: 'requiredIf:$1:$2',
      params: [or]
    }]
  };

  context('with satisfied parameter', () => {
    it('should success with valid input', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should fail with invalid input', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.address).to.have.property('requiredIf:$1:$2')
        .that.equals('Address field is required.');
    });
  });

  context('with unsatisfied parameter', () => {
    it('should success with different input dependency value', () => {
      const result = validator.validate(rules, {
        hasHome: 'yess'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should success with empty input', () => {
      const result = validator.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });
  });
}

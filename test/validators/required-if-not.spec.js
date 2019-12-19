import noes from 'noes';
import { expect } from 'chai';
import validator from '../../lib';
import requiredIf from '../../lib/validators/required-if';

describe('Required if not validator', () => {
  context('with validator wrapper', () => {
    context('when given normal parameters', () => {
      const simpleRules = {
        address: ['requiredIfNot:hasHome:Yes']
      };

      it('should success if hasHome is No and address is defined', () => {
        const result = validator.validate(simpleRules, {
          hasHome: 'No',
          address: 'somewhere over the rainbow'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('address');
      });

      it('should success if hasHome is not defined and address is defined', () => {
        const result = validator.validate(simpleRules, {
          address: 'somewhere over the rainbow'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('address');
      });

      it('should fail if input is empty', () => {
        const result = validator.validate(simpleRules, {});
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('address');
        expect(err.address['requiredIfNot:$1:$2']).to.equal('Address field is required.');
      });

      it('should fail if hasHome is No and address is not defined', () => {
        const result = validator.validate(simpleRules, {
          hasHome: 'No'
        });
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('address');
        expect(err.address['requiredIfNot:$1:$2']).to.equal('Address field is required.');
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
      fullName: 'requiredIfNot:$1:$2',
      params: [and]
    }]
  };

  context('with satisfied parameter', () => {
    it('should success if address is not defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        hasApartment: 'yo'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should success if address is defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        hasApartment: 'yo',
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });
  });

  context('with unsatisfied parameter', () => {
    it('should fail if address is not defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        hasApartment: 'yoo'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.address).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Address field is required.');
    });

    it('should success if address is defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        hasApartment: 'yoo',
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should success if address is defined', () => {
      const result = validator.validate(rules, {
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should fail if input is empty', () => {
      const result = validator.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.address).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Address field is required.');
    });
  });
}

function testWithOr(or) {
  const rules = {
    address: [{
      fullName: 'requiredIfNot:$1:$2',
      params: [or]
    }]
  };

  context('with satisfied parameter', () => {
    it('should success if address is defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes',
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should success if address is not defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yes'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });
  });

  context('with unsatisfied parameter', () => {
    it('should fail if address is not defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yess'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.address).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Address field is required.');
    });

    it('should success if address is defined', () => {
      const result = validator.validate(rules, {
        hasHome: 'yess',
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should success if address is defined', () => {
      const result = validator.validate(rules, {
        address: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('address');
    });

    it('should fail if input is empty', () => {
      const result = validator.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.address).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Address field is required.');
    });
  });
}

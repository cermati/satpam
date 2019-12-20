import noes from 'noes';
import { expect } from 'chai';
import validator from '../../lib';

describe('Required if not validator', () => {
  context('with validator wrapper', () => {
    context('when given normal parameters', () => {
      const simpleRules = {
        company: ['requiredIfNot:job:Household Wife']
      };

      it('should success if job is Lawyer and company is defined', () => {
        const result = validator.validate(simpleRules, {
          job: 'Laywer',
          company: 'somewhere over the rainbow'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('company');
      });

      it('should success if job is Household Wife and company is not defined', () => {
        const result = validator.validate(simpleRules, {
          job: 'Household Wife'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('company');
      });

      it('should success if job is not defined and company is defined', () => {
        const result = validator.validate(simpleRules, {
          company: 'somewhere over the rainbow'
        });
        const err = result.messages;

        expect(result.success).to.equal(true);
        expect(err).to.not.have.property('company');
      });

      it('should fail if input is empty', () => {
        const result = validator.validate(simpleRules, {});
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('company');
        expect(err.company['requiredIfNot:$1:$2']).to.equal('Company field is required.');
      });

      it('should fail if job is Lawyer and company is not defined', () => {
        const result = validator.validate(simpleRules, {
          job: 'Lawyer'
        });
        const err = result.messages;

        expect(result.success).to.equal(false);
        expect(err).to.have.property('company');
        expect(err.company['requiredIfNot:$1:$2']).to.equal('Company field is required.');
      });
    });

    context('when given `Or` structure as parameter', () => {
      context('and it\'s an `Or` instance', () => {
        const or = new noes.Or({
          job: 'Household Wife',
          partnerJob: 'Household Husband'
        });

        testWithOr(or);
      });

      context('and it\'s an object with type equals to or', () => {
        const or = {
          type: 'or',
          mappings: {
            job: 'Household Wife',
            partnerJob: 'Household Husband'
          }
        };

        testWithOr(or);
      });
    });

    context('when given `And` structure as parameter', () => {
      context('and it\'s an `And` instance', () => {
        const and = new noes.And({
          job: 'Household Wife',
          partnerJob: 'Household Husband'
        });

        testWithAnd(and);
      });

      context('and it\'s an object with type equals to and', () => {
        const and = {
          type: 'and',
          mappings: {
            job: 'Household Wife',
            partnerJob: 'Household Husband'
          }
        };

        testWithAnd(and);
      });
    });
  });
});

function testWithAnd(and) {
  const rules = {
    company: [{
      fullName: 'requiredIfNot:$1:$2',
      params: [and]
    }]
  };

  context('with satisfied parameter', () => {
    it('should success if company is not defined', () => {
      const result = validator.validate(rules, {
        job: 'Household Wife',
        partnerJob: 'Household Husband'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });

    it('should success if company is defined', () => {
      const result = validator.validate(rules, {
        job: 'Household Wife',
        partnerJob: 'Household Husband',
        company: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });
  });

  context('with unsatisfied parameter', () => {
    it('should fail if company is not defined', () => {
      const result = validator.validate(rules, {
        job: 'Household Wife',
        partnerJob: 'Lawyer'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.company).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Company field is required.');
    });

    it('should success if company is defined', () => {
      const result = validator.validate(rules, {
        job: 'Household Wife',
        partnerJob: 'Lawyer',
        company: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });

    it('should success if company is defined', () => {
      const result = validator.validate(rules, {
        company: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });

    it('should fail if input is empty', () => {
      const result = validator.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.company).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Company field is required.');
    });
  });
}

function testWithOr(or) {
  const rules = {
    company: [{
      fullName: 'requiredIfNot:$1:$2',
      params: [or]
    }]
  };

  context('with satisfied parameter', () => {
    it('should success if company is defined', () => {
      const result = validator.validate(rules, {
        job: 'Household Wife',
        company: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });

    it('should success if company is not defined', () => {
      const result = validator.validate(rules, {
        job: 'Household Wife'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });
  });

  context('with unsatisfied parameter', () => {
    it('should fail if company is not defined', () => {
      const result = validator.validate(rules, {
        job: 'Lawyer'
      });
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.company).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Company field is required.');
    });

    it('should success if company is defined', () => {
      const result = validator.validate(rules, {
        job: 'Lawyer',
        company: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });

    it('should success if company is defined', () => {
      const result = validator.validate(rules, {
        company: 'wut'
      });
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('company');
    });

    it('should fail if input is empty', () => {
      const result = validator.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.company).to.have.property('requiredIfNot:$1:$2')
        .that.equals('Company field is required.');
    });
  });
}

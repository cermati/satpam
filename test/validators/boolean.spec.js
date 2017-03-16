import { expect } from 'chai';
import validator from '../../lib';

describe('Boolean validator', () => {
  const rules = {
    paid: ['boolean']
  };

  context('when value is not passed', () => {
    it('should success', () => {
      const result = validator.validate(rules, {});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('paid');
    });
  });

  context('when given false', () => {
    it('should success', () => {
      const result = validator.validate(rules, {paid: false});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('paid');
    });
  });

  context('when given true', () => {
    it('should success', () => {
      const result = validator.validate(rules, {paid: true});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('paid');
    });
  });

  context(`when given string 'false'`, () => {
    it('should fail', () => {
      const testObj = {paid: 'false'};
      const result = validator.validate(rules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('paid');
      expect(err.paid.boolean).to.equal('Paid must be a boolean.');
    });
  });

  context(`when given string 'true'`, () => {
    it('should fail', () => {
      const testObj = {paid: 'true'};
      const result = validator.validate(rules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('paid');
      expect(err.paid.boolean).to.equal('Paid must be a boolean.');
    });
  });
});


import { expect } from 'chai';
import validator from '../../lib';

describe('Numeric validator', () => {
  const rules = {
    income: ['numeric']
  };

  context('with integer digits', () => {
    it('should success', () => {
      const result = validator.validate(rules, {income: '123'});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('income');
    });
  });

  context('with floating number', () => {
    it('should success', () => {
      const result = validator.validate(rules, {income: 123.40});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('income');
    });
  });

  context('with invalid number', () => {
    it('should fail', () => {
      const testObj = {income: '123a'};
      const result = validator.validate(rules, testObj);
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('income');
      expect(err.income.numeric).to.equal('Income must be a number.');
    });
  });
});


import { expect } from 'chai';
import validator from '../../lib';

describe('not disposable email validator', () => {
  const rules = {
    email: ['notDisposableEmail']
  };

  context('given undefined value', () => {
    const input = {
      email: undefined
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given null value', () => {
    const input = {
      email: null
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given empty string value', () => {
    const input = {
      email: ''
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given invalid value (garbage)', () => {
    const input = {
      email: '#@%^%#$@#$@#.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given invalid value (two @ sign)', () => {
    const input = {
      email: 'email@domain@domain.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given valid value (regular)', () => {
    const input = {
      email: 'friends@hello.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given valid value (plus sign is considered valid character)', () => {
    const input = {
      email: 'firstname+lastname@domain.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given something that listed in the disposable domain list', () => {
    const input = {
      email: '1234567890@mailinator.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should not success', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });
});

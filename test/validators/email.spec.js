import { expect } from 'chai';
import validator from '../../lib';

describe('email validator', () => {
  const rules = {
    email: ['email']
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

  context('given invalid value (number)', () => {
    const input = {
      email: 123
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given invalid value (boolean)', () => {
    const input = {
      email: true
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given invalid value (object)', () => {
    const input = {
      email: {}
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given invalid value (array)', () => {
    const input = {
      email: []
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
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

  context('given invalid value (missing username)', () => {
    const input = {
      email: '@domain.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given invalid value (multiple dots)', () => {
    const input = {
      email: 'email..email@domain.com'
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

  context('given invalid value (text followed email is not allowed)', () => {
    const input = {
      email: 'email@domain.com (Joe Smith)'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should fail', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given invalid value (missing domain)', () => {
    const input = {
      email: 'friends@'
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

  context('given valid value (underscore in the address field)', () => {
    const input = {
      email: '_______@domain.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given valid value (dash in domain name)', () => {
    const input = {
      email: 'email@domain-one.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given valid value (digit in address)', () => {
    const input = {
      email: '1234567890@domain.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('email');
    });
  });

  context('given the email has dot in in last character and it is a gmail account', () => {
    const input = {
      email: '1234567890.@gmail.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });

  context('given the email has dot in in last character and it is not a gmail account', () => {
    const input = {
      email: '1234567890.@domain.com'
    };
    const result = validator.validate(rules, input);
    const err = result.messages;

    it('should success', () => {
      expect(result.success).to.equal(false);
      expect(err).to.have.property('email');
    });
  });
});

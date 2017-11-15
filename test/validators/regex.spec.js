import { expect } from 'chai';
import validator from '../../lib';

describe('Regex validator', () => {
  const rules = {
    str: ['regex']
  };

  it ('should success if str is a null', () => {
    const result = validator.validate(rules, {
      str: null
    });
    const err = result.messages;
    
    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('str');
  });

  it('should success if str is an empty string', () => {
    const result = validator.validate(rules, {
      str: ''
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('str');
  });

  it ('should success if str is a numeric', () => {
    const result = validator.validate(rules, {
      str: 1238
    });
    const err = result.messages;
    
    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('str');
  });

  it ('should success if str is a valid regex', () => {
    const result = validator.validate(rules, {
      str: '/ab+c/'
    });
    const err = result.messages;
    
    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('str');
  });

  it ('should fail if str is not a valid regex', () => {
    const result = validator.validate(rules, {
      str: '/(^'
    });
    const err = result.messages;
    
    expect(result.success).to.equal(false);
    expect(err).to.have.property('str');
  });
});

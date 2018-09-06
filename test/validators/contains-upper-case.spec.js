import { expect } from 'chai';
import validator from '../../lib';

describe('Contains digit validator', () => {
  const rules = {
    someField: ['containsUpperCase']
  };

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: 'bOzz'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 'bozz'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField.containsUpperCase).to.equal('Some Field must contain at least 1 upper case character.');
  });
});

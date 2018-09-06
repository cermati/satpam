import { expect } from 'chai';
import validator from '../../lib';

describe('Contains digit validator', () => {
  const rules = {
    someField: ['containsDigit']
  };

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: 'b0zz'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 'bozz'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField.containsDigit).to.equal('Some Field must contain at least 1 digit.');
  });
});

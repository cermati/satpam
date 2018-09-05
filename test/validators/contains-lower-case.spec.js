import { expect } from 'chai';
import validator from '../../lib';

describe('Contains digit validator', () => {
  const rules = {
    someField: ['containsLowerCase']
  };

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: 'BoZZ'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 'BOZZ'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField.containsLowerCase).to.equal('Some Field must contain at least 1 lower case character.');
  });
});

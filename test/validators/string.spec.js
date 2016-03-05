import { expect } from 'chai';
import validator from '../../lib';

describe('String validator', () => {
  const rules = {
    someField: ['string']
  };

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: 'yoyoyo'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 123});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField.string).to.equal('Some Field is not a string.');
  });
});

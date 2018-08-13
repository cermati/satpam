import { expect } from 'chai';
import validator from '../../lib';

describe('Multiple of validator', () => {
  const rules = {
    someField: ['multipleOf:2']
  };

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: 2});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 1});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField['multipleOf:$1']).to.equal('Some Field must be a multiple of 2.');
  });
});

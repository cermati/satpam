import { expect } from 'chai';
import validator from '../../lib';

describe('Contains alphabet validator', () => {
  const rules = {
    someField: ['containsAlphabet']
  };

  it('should success with no input', () => {
    const result = validator.validate(rules, {});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: '42I23'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: '42423'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField.containsAlphabet).to.equal('Some Field must contain at least 1 alphabet.');
  });
});

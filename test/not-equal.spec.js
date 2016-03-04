import { expect } from 'chai';
import validator from '../lib';

describe('Not equal validator', () => {
  const rules = {
    someField: ['not-equal:ya-shall-nat-pazz']
  };

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: 'pazz'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 'ya-shall-nat-pazz'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField['not-equal:$1'])
      .to.equal('Some Field must not equal to ya-shall-nat-pazz.');
  });
});

import { expect } from 'chai';
import validator from '../../lib';

describe('Not equal to field validator', () => {
  const rules = {
    someField: ['not-equal-to-field:anotherField']
  };

  it('should success with valid input', () => {
    const result = validator.validate(rules, {someField: 'ya-shall-nat-pazz', anotherField: 'pazz'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {someField: 'ya-shall-nat-pazz', anotherField: 'ya-shall-nat-pazz'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField['not-equal-to-field:$1'])
      .to.equal('Some Field must not equal to ya-shall-nat-pazz.');
  });
});

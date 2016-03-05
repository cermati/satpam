import { expect } from 'chai';
import validator from '../../lib';

describe('Date validator', () => {
  const rules = {
    birthday: ['date']
  };

  it('should success', () => {
    const result = validator.validate(rules, {birthday: '02-09-1993'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('birthday');
  });

  it('should fail', () => {
    const result = validator.validate(rules, {birthday: '02--09-1993'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('birthday');
    expect(err.birthday.date).to.equal('Birthday is not a valid date.');
  });
});

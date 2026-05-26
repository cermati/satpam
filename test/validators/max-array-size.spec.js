import { expect } from 'chai';
import validator from '../../lib';

describe('MaxArraySize validator', () => {
  const rules = {
    phoneNumbers: ['maxArraySize:3']
  };

  it('should success when array length is equal to max', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890', '+6289876543210', '+6281111111111'] });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('phoneNumbers');
  });

  it('should success when array length is less than max', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890', '+6289876543210'] });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('phoneNumbers');
  });

  it('should success when array is empty', () => {
    const result = validator.validate(rules, { phoneNumbers: [] });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('phoneNumbers');
  });

  it('should success when value is nil', () => {
    const result = validator.validate(rules, { phoneNumbers: null });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('phoneNumbers');
  });

  it('should fail when array length is greater than max', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890', '+6289876543210', '+6281111111111', '+6282222222222'] });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers['maxArraySize:$1']).to.equal('Phone Numbers must have at most 3 item(s).');
  });

  it('should fail when value is not an array', () => {
    const result = validator.validate(rules, { phoneNumbers: '+6281234567890' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers['maxArraySize:$1']).to.equal('Phone Numbers must have at most 3 item(s).');
  });
});

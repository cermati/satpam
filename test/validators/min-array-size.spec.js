import { expect } from 'chai';
import validator from '../../lib';

describe('MinArraySize validator', () => {
  const rules = {
    phoneNumbers: ['minArraySize:2']
  };

  it('should success when array length is equal to min', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890', '+6289876543210'] });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('phoneNumbers');
  });

  it('should success when array length is greater than min', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890', '+6289876543210', '+6281111111111'] });
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

  it('should fail when array length is less than min', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890'] });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers['minArraySize:$1']).to.equal('Phone Numbers must have at least 2 item(s).');
  });

  it('should fail when array is empty', () => {
    const result = validator.validate(rules, { phoneNumbers: [] });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers['minArraySize:$1']).to.equal('Phone Numbers must have at least 2 item(s).');
  });

  it('should fail when value is not an array', () => {
    const result = validator.validate(rules, { phoneNumbers: '+6281234567890' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers['minArraySize:$1']).to.equal('Phone Numbers must have at least 2 item(s).');
  });
});

import { expect } from 'chai';
import validator from '../../lib';

describe('NotEmptyStringItems validator', () => {
  const rules = {
    phoneNumbers: ['notEmptyStringItems']
  };

  it('should success when array has no empty string', () => {
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

  it('should success when array contains non-string items', () => {
    const result = validator.validate(rules, { phoneNumbers: [1, 2] });
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

  it('should fail when array contains an empty string', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890', ''] });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers.notEmptyStringItems).to.equal('Phone Numbers must not contain empty string item(s).');
  });

  it('should fail when array contains a whitespace-only string', () => {
    const result = validator.validate(rules, { phoneNumbers: ['+6281234567890', '   '] });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers.notEmptyStringItems).to.equal('Phone Numbers must not contain empty string item(s).');
  });

  it('should fail when value is not an array', () => {
    const result = validator.validate(rules, { phoneNumbers: '+6281234567890' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('phoneNumbers');
    expect(err.phoneNumbers.notEmptyStringItems).to.equal('Phone Numbers must not contain empty string item(s).');
  });

  it('should be combinable with array size rules', () => {
    const combinedRules = {
      phoneNumbers: ['minArraySize:2', 'maxArraySize:3', 'notEmptyStringItems']
    };
    const result = validator.validate(combinedRules, { phoneNumbers: ['+6281234567890', ' '] });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.phoneNumbers).to.not.have.property('minArraySize:$1');
    expect(err.phoneNumbers).to.not.have.property('maxArraySize:$1');
    expect(err.phoneNumbers.notEmptyStringItems).to.equal('Phone Numbers must not contain empty string item(s).');
  });

  it('should show array error when combined with array rule and value is not an array', () => {
    const combinedRules = {
      phoneNumbers: ['array', 'notEmptyStringItems']
    };
    const result = validator.validate(combinedRules, { phoneNumbers: '+6281234567890' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.phoneNumbers.array).to.equal('Phone Numbers is not an array.');
  });
});

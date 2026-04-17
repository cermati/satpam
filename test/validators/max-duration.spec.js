import { expect } from 'chai';
import validator from '../../lib';

describe('MaxDuration validator', () => {
  const rules = {
    schedule: ['maxDuration:PT1H']
  };

  it('should success with duration equal to maximum', () => {
    const result = validator.validate(rules, { schedule: 'PT1H' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should success with duration less than maximum', () => {
    const result = validator.validate(rules, { schedule: 'PT30M' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should fail with duration greater than maximum', () => {
    const result = validator.validate(rules, { schedule: 'PT3H' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
    expect(err.schedule['maxDuration:$1']).to.include('Schedule must be at most PT1H.');
  });

  it('should success with empty value (optional field)', () => {
    const result = validator.validate(rules, { schedule: '' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should success with null value (optional field)', () => {
    const result = validator.validate(rules, { schedule: null });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should fail with invalid duration value', () => {
    const result = validator.validate(rules, { schedule: 'invalid-duration' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
  });

  it('should fail with invalid maximum param', () => {
    const invalidParamRules = {
      schedule: ['maxDuration:invalid-param']
    };
    const result = validator.validate(invalidParamRules, { schedule: 'PT1H' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
  });

  it('should fail with larger unit exceeding maximum', () => {
    const result = validator.validate(rules, { schedule: 'P1D' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
  });
});

import { expect } from 'chai';
import validator from '../../lib';

describe('iso8601MinDuration validator', () => {
  const rules = {
    schedule: ['iso8601MinDuration:PT1H']
  };

  it('should success with duration equal to minimum', () => {
    const result = validator.validate(rules, { schedule: 'PT1H' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should success with duration greater than minimum', () => {
    const result = validator.validate(rules, { schedule: 'PT2H' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should fail with duration less than minimum', () => {
    const result = validator.validate(rules, { schedule: 'PT30M' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
    expect(err.schedule['iso8601MinDuration:$1']).to.include('Schedule must be at least PT1H.');
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

  it('should fail with invalid minimum param', () => {
    const invalidParamRules = {
      schedule: ['iso8601MinDuration:invalid-param']
    };
    const result = validator.validate(invalidParamRules, { schedule: 'PT1H' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
  });

  it('should success with larger unit exceeding minimum', () => {
    const result = validator.validate(rules, { schedule: 'P1D' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });
});

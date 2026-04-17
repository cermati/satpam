import { expect } from 'chai';
import validator from '../../lib';

describe('iso8601Duration validator', () => {
  const rules = {
    schedule: ['iso8601Duration']
  };

  it('should success with valid ISO 8601 duration', () => {
    const result = validator.validate(rules, { schedule: 'P1Y2M3DT4H5M6S' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
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

  it('should fail with invalid ISO 8601 duration', () => {
    const result = validator.validate(rules, { schedule: 'invalid-duration' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
    expect(err.schedule['iso8601Duration']).to.include('Schedule must be a valid ISO 8601 duration.');
  });

  it('should fail with a plain number string', () => {
    const result = validator.validate(rules, { schedule: '12345' });
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('schedule');
    expect(err.schedule['iso8601Duration']).to.include('Schedule must be a valid ISO 8601 duration.');
  });

  it('should success with duration in weeks format', () => {
    const result = validator.validate(rules, { schedule: 'P3W' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should success with time-only duration', () => {
    const result = validator.validate(rules, { schedule: 'PT4H30M' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });

  it('should success with duration in millisecond format', () => {
    const result = validator.validate(rules, { schedule: 'PT0.1S' });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('schedule');
  });
});

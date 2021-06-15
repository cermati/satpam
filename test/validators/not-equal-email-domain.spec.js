import { expect } from 'chai';
import validator from '../../lib';

describe('Not equal email domain validator', () => {
  const rules = {
    someField: ['not-equal-email-domain:cermati.com,indodana.com']
  };

  it('should success with empty email', () => {
    const result = validator.validate(rules, {someField: ''});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should success with domain gmail.com', () => {
    const result = validator.validate(rules, {someField: 'randy@gmail.com'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should success with domain yahoo.com', () => {
    const result = validator.validate(rules, {someField: 'randy@yahoo.com'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid email', () => {
    const result = validator.validate(rules, {someField: 'randygmail.com'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField['not-equal-email-domain:$1']).to.equal('Some Field\'s domain is not valid.');
  });

  it('should fail with domain cermati.com', () => {
    const result = validator.validate(rules, {someField: 'randy@cermati.com'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField['not-equal-email-domain:$1']).to.equal('Some Field\'s domain is not valid.');
  });

  it('should fail with domain indodana.com', () => {
    const result = validator.validate(rules, {someField: 'randy@indodana.com'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField['not-equal-email-domain:$1']).to.equal('Some Field\'s domain is not valid.');
  });
});

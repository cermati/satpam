import { expect } from 'chai';
import validator from '../../lib';

describe('Empty string validator', () => {
  const rules = {
    name: ['emptyString']
  };

  it('should success when given empty string', () => {
    const result = validator.validate(rules, {name: ''});
    const err = result.messages;

    expect(result.success).to.be.true;
    expect(err).to.not.have.property('name');
  });

  it('should fail with whitespace', () => {
    const result = validator.validate(rules, {name: ' '});
    const err = result.messages;

    expect(result.success).to.be.false;
    expect(err).to.have.property('name');
    expect(err.name.emptyString).to.equal('Name field must be an empty string.');
  });

  it('should fail with invalid input', () => {
    const result = validator.validate(rules, {name: 'x'});
    const err = result.messages;

    expect(result.success).to.be.false;
    expect(err).to.have.property('name');
    expect(err.name.emptyString).to.equal('Name field must be an empty string.');
  });
});


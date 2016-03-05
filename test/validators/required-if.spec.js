import { expect } from 'chai';
import validator from '../../lib';

describe('Required if validator', () => {
  const simpleRules = {
    address: ['requiredIf:hasHome:Yes']
  };

  it('should success if hasHome equals to Yes', () => {
    const result = validator.validate(simpleRules, {
      hasHome: 'Yes',
      address: 'somewhere over the rainbow'
    });
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
  });

  it('should success if hasHome is undefined', () => {
    const result = validator.validate(simpleRules, {});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
  });

  it('should fail', () => {
    const input = {hasHome: 'Yes'};
    const result = validator.validate(simpleRules, input);
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('address');
    expect(err.address['requiredIf:$1:$2']).to.equal('Address field is required.');
  });
});

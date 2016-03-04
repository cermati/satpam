import { expect } from 'chai';
import validator from '../lib';

describe('Alphanumeric validator', () => {
  const rules = {
    name: ['alphanumeric']
  };

  it('should success', () => {
    const result = validator.validate(rules, {name: 'sendy123'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
  });

  it('should fail', function () {
    const testObj = {name: 'sendy123_ hehe'};
    const result = validator.validate(rules, testObj);
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('name');
    expect(err.name.alphanumeric).to.equal('Name may only contain letters and numbers.');
  });
});

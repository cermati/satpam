import expect from 'chai';
import validator from '../lib';

describe('Alpha validator', () => {
  const rules = {
    name: ['alpha']
  };

  it('should success', () => {
    const result = validator.validate(rules, {name: 'sendy'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
  });

  it('should fail', () => {
    const testObj = {name: 'sendy2 hehe'};
    const result = validator.validate(rules, testObj);
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('name');
    expect(err.name.alpha).to.equal('Name may only contain letters.');
  });
});

import { expect } from 'chai';
import validator from '../../lib';

describe('Url validator', () => {
  const rules = {
    website: ['url']
  };

  it('should success', () => {
    const result = validator.validate(rules, {website: 'https://wikipedia.org'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('website');
  });

  it('should success on valid IPv4 address', () => {
    const result = validator.validate(rules, {website: '216.58.212.142'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('website');
  });

  it('should fail on invalid IPv4 address (more than 255)', () => {
    const result = validator.validate(rules, {website: '1.1.1.256'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('website');
    expect(err.website.url).to.equal('Website is not a valid url.');
  });

  it('should fail', () => {
    const result = validator.validate(rules, {website: 'https:/\wikipedia.org'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('website');
    expect(err.website.url).to.equal('Website is not a valid url.');
  });
});

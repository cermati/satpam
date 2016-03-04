import { expect } from 'chai';
import validator from '../lib';

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

  it('should fail', () => {
    const result = validator.validate(rules, {website: 'https:/\wikipedia.org'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('website');
    expect(err.website.url).to.equal('Website is not a valid url.');
  });
});

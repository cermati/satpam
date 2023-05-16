import { expect } from 'chai';
import validator from '../../lib';

describe('url protocol validator', () => {
  const rules = {
    url: ['urlProtocol:https']
  };

  it('should success', () => {
    const result = validator.validate(rules, {url: 'https://wikipedia.org'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('url');
  });

  it('should fail on invalid protocol', () => {
    const result = validator.validate(rules, {url: 'http://wikipedia.org'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('url');
    expect(err.url['urlProtocol:$1']).to.equal('Url does not have a valid url protocol.');
  });

  it('should fail on empty protocol', () => {
    const result = validator.validate(rules, {url: 'wikipedia.org'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('url');
    expect(err.url['urlProtocol:$1']).to.equal('Url does not have a valid url protocol.');
  });
});

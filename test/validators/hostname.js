import {expect} from 'chai';
import validator from '../../lib';

describe('IP address or Host validator', () => {
  const rules = {
    ipaddr: ['hostname']
  };

  it('should success on valid Host', () => {
    const result = validator.validate(rules, {ipaddr: 'https://stg-k-api.indodana.com/chermes/public/v1/stub/merchant/always-accept-purchase-transaction'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('ipaddr');
  });

  it('should success on valid Host only', () => {
    const result = validator.validate(rules, {ipaddr: 'https://stg-k-api.indodana.com'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('ipaddr');
  });

  it('should fail on http://localhost', () => {
    const result = validator.validate(rules, {ipaddr: 'http://localhost'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('ipaddr');
    expect(err.ipaddr['hostname']).to.equal('Ipaddr is not a valid Host.');
  });

  it('should not fail on empty string', () => {
    const result = validator.validate(rules, {ipaddr: undefined});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('ipaddr');
  });
});

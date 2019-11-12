import {expect} from 'chai';
import validator from '../../lib';

describe('IP address or Host validator', () => {
  const rules = {
    ipaddr: ['ip-or-host']
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

  it('should success on valid IPv4 address', () => {
    const result = validator.validate(rules, {ipaddr: '216.58.212.142'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('ipaddr');
  });

  it('should success on valid IPv6 address', () => {
    const result = validator.validate(rules, {ipaddr: '2001:db8:0000:1:1:1:1:1'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('ipaddr');
  });

  it('should fail on invalid IPv4 address (more than 255)', () => {
    const result = validator.validate(rules, {ipaddr: '1.1.1.256'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('ipaddr');
    expect(err.ipaddr['ip-or-host']).to.equal('Ipaddr is not a valid IP address or Host.');
  });

  it('should fail on invalid IPv6 address', () => {
    const result = validator.validate(rules, {ipaddr: '2001:db8:0000:1:1:1:1::1'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('ipaddr');
    expect(err.ipaddr['ip-or-host']).to.equal('Ipaddr is not a valid IP address or Host.');
  });

  it('should fail on http://localhost', () => {
    const result = validator.validate(rules, {ipaddr: 'http://localhost'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('ipaddr');
    expect(err.ipaddr['ip-or-host']).to.equal('Ipaddr is not a valid IP address or Host.');
  });

  it('should fail on empty string', () => {
    const result = validator.validate(rules, {ipaddr: undefined});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('ipaddr');
  });
});

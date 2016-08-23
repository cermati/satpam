import { expect } from 'chai';
import validator from '../../lib';

describe('IP address validator', () => {
  const rules = {
    ipaddr: ['ip']
  };

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
    expect(err.ipaddr.ip).to.equal('Ipaddr is not a valid IP address.');
  });

  it('should fail on invalid IPv6 address', () => {
    const result = validator.validate(rules, {ipaddr: '2001:db8:0000:1:1:1:1::1'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('ipaddr');
    expect(err.ipaddr.ip).to.equal('Ipaddr is not a valid IP address.');
  });
});

import { expect } from 'chai';
import validator from '../../lib';

describe('FQDN validator', () => {
  const rules = {
    addr: ['fqdn']
  };

  it('should success', () => {
    const result = validator.validate(rules, {addr: 'foo.com'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('addr');
  });


  it('should fail', () => {
    const result = validator.validate(rules, {addr: 'f!oo.bar'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('addr');
    expect(err.addr.fqdn).to.equal('Addr is not a valid FQDN.');
  });
});

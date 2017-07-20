import { expect } from 'chai';
import validator from '../../lib';

describe('IMEI validator', () => {
  const rules = {
    imeiNumber: ['imei']
  };

  it('should success', () => {
    const result = validator.validate(rules, {imeiNumber: '990000862471853'});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('imeiNumber');
  });

  it('should fail', () => {
    const result = validator.validate(rules, {imeiNumber: '990000862471854'});
    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('imeiNumber');
    expect(err.imeiNumber.imei).to.equal('Imei Number is not a valid IMEI.');
  });
});

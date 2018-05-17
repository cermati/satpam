import { expect } from 'chai';
import validator from '../../lib';

describe('Indonesia id card number valid province validator', () => {
  const rules = {
    idCard: ['indonesiaIdCardNumberValidProvince']
  };

  it('should success when given empty id card', () => {
    const result = validator.validate(rules, {});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('indonesiaIdCardNumberValidProvince');
  });

  it('should success when id card province code is valid', () => {
    const result = validator.validate(rules, {
      idCard: '3100000000000000' // DKI Jakarta
    });

    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('idCard');
  });

  it('should success when id card province code is invalid', () => {
    const result = validator.validate(rules, {
      idCard: '2000000000000000' // No mapping for 20
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberValidProvince')
      .that.equals('Id Card province code is not valid.');
  });
});


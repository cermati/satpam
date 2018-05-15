import { expect } from 'chai';
import validator from '../../lib';

describe('Indonesia id card number birth date validator', () => {
  const rules = {
    idCard: ['indonesiaIdCardNumberProvince:province']
  };

  it('should success when given empty id card', () => {
    const result = validator.validate(rules, {});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('indonesiaIdCardNumberProvince:$1');
  });

  it('should success when id card province code matches province code', () => {
    const result = validator.validate(rules, {
      idCard: '1100000000000000',
      province: 'ACEH'
    });

    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('idCard');
  });

  it('should success when id card province code matches province code (inputted province is not upper case)', () => {
    const result = validator.validate(rules, {
      idCard: '1100000000000000',
      province: 'aceh'
    });

    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('idCard');
  });

  it('should fail when id card province code does not match province code', () => {
    const result = validator.validate(rules, {
      idCard: '1100000000000000',
      province: 'RIAU'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberProvince:$1')
      .that.equals('Id Card province code does not match province input.');
  });

  it('should fail when province is invalid', () => {
    const result = validator.validate(rules, {
      idCard: '1100000000000000',
      province: 'DI ACEH'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberProvince:$1')
      .that.equals('Id Card province code does not match province input.');
  });

  it('should fail when no province is given', () => {
    const result = validator.validate(rules, {
      idCard: '1100000000000000'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberProvince:$1')
      .that.equals('Id Card province code does not match province input.');
  });
});


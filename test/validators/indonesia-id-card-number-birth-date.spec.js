import { expect } from 'chai';
import validator from '../../lib';

describe('Indonesia id card nmber birth date validator', () => {
  const rules = {
    idCard: ['indonesiaIdCardNumberBirthDate:birthDate:DD-MM-YYYY']
  };

  it('should success when given empty id card', () => {
    const result = validator.validate(rules, {});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('indonesiaIdCardNumberBirthDate:$1:$2');
  });

  it('should success when given valid id card', () => {
    const result = validator.validate(rules, {
      idCard: '0123450209933456',
      birthDate: '02-09-93'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberBirthDate:$1:$2')
      .that.equals('Id Card birth date number sequence does not match the given birth date.');
  });

  it('should success when given invalid id card that does not match birth date', () => {
    const result = validator.validate(rules, {
      idCard: '0123450209933456',
      birthDate: '02-10-93'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberBirthDate:$1:$2')
      .that.equals('Id Card birth date number sequence does not match the given birth date.');
  });
});


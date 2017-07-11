import { expect } from 'chai';
import validator from '../../lib';

describe('Indonesia id card nmber birth date validator', () => {
  const rules = {
    idCard: ['indonesiaIdCardNumberGender:gender:female:male']
  };

  it('should success when given empty id card', () => {
    const result = validator.validate(rules, {});
    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('indonesiaIdCardNumberGender:$1:$2:$3');
  });

  it('should success when id card gender code matches male', () => {
    const result = validator.validate(rules, {
      idCard: '0123450209933456',
      gender: 'male'
    });

    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('idCard');
  });

  it('should success when id card gender code matches female', () => {
    const result = validator.validate(rules, {
      idCard: '0123454109933456',
      gender: 'female'
    });

    const err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('idCard');
  });

  it('should fail when id card gender code does not match male', () => {
    const result = validator.validate(rules, {
      idCard: '0123450209933456',
      gender: 'female'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberGender:$1:$2:$3')
      .that.equals('Id Card gender code does not match gender input.');
  });

  it('should fail when id card gender code does not match female', () => {
    const result = validator.validate(rules, {
      idCard: '0123454209933456',
      gender: 'male'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberGender:$1:$2:$3')
      .that.equals('Id Card gender code does not match gender input.');
  });

  it('should fail when id card gender is invalid', () => {
    const result = validator.validate(rules, {
      idCard: '0123454209933456',
      gender: 'malee'
    });

    const err = result.messages;

    expect(result.success).to.equal(false);
    expect(err.idCard).to.have.property('indonesiaIdCardNumberGender:$1:$2:$3')
      .that.equals('Id Card gender code does not match gender input.');
  });
});


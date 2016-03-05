import { expect } from 'chai';
import validator from '../../lib';

describe('MinValue validator', () => {
  const ruleWithParam = {
    favoriteNumber: ['minValue:50']
  };

  it('should success for number type greater or equal to limit', () => {
    const acceptedInputs = [
      50,
      51,
      100
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should success for number as string type greater or equal to limit', () => {
    const acceptedInputs = [
      '50',
      '51',
      '100'
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should fail for non number', () => {
    const rejectedInputs = [
      '1-1-1+1',
      'asdasd',
      {lol: 'wut'},
      null,
      undefined
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['minValue:$1']).to.equal('Favorite Number must be greater than or equal to 50.');
    });
  });

  it('should fail for number type less than limit', () => {
    const rejectedInputs = [
      49,
      1,
      0,
      -1
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['minValue:$1']).to.equal('Favorite Number must be greater than or equal to 50.');
    });
  });

  it('should fail for number as string type greater than limit', () => {
    const rejectedInputs = [
      '49',
      '1',
      '0',
      '-1'
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['minValue:$1']).to.equal('Favorite Number must be greater than or equal to 50.');
    });
  });
});

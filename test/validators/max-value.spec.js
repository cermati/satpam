import { expect } from 'chai';
import validator from '../../lib';

describe('MaxValue validator', () => {
  const ruleWithParam = {
    favoriteNumber: ['maxValue:50']
  };

  it('should success for number type lower or equal to limit', () => {
    const acceptedInputs = [
      -1,
      0,
      15,
      49,
      50
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      const err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should success for number as string type lower or equal to limit', () => {
    const acceptedInputs = [
      '-1',
      '0',
      '15',
      '49',
      '50'
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
      expect(err.favoriteNumber['maxValue:$1']).to.equal('Favorite Number must be less than or equal to 50.');
    });
  });

  it('should fail for number type greater than limit', () => {
    const rejectedInputs = [
      51,
      100
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['maxValue:$1']).to.equal('Favorite Number must be less than or equal to 50.');
    });
  });

  it('should fail for number as string type greater than limit', () => {
    const rejectedInputs = [
      '51',
      '100'
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      const result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      const err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['maxValue:$1']).to.equal('Favorite Number must be less than or equal to 50.');
    });
  });
});

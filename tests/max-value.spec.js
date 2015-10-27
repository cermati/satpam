'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('MaxValue validator', function () {
  var ruleWithParam = {
    favoriteNumber: ['maxValue:50']
  };

  it('should success for number type lower or equal to limit', function () {
    var acceptedInputs = [
      -1,
      0,
      15,
      49,
      50
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should success for number as string type lower or equal to limit', function () {
    var acceptedInputs = [
      '-1',
      '0',
      '15',
      '49',
      '50'
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should success for non number', function () {
    var acceptedInputs = [
      '1-1-1+1',
      'asdasd',
      {lol: 'wut'}
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should fail for number type greater than limit', function () {
    var rejectedInputs = [
      51,
      100
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['maxValue:$1']).to.equal('Favorite Number must be less than or equal to 50.');
    });
  });

  it('should fail for number as string type greater than limit', function () {
    var rejectedInputs = [
      '51',
      '100'
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['maxValue:$1']).to.equal('Favorite Number must be less than or equal to 50.');
    });
  });
});

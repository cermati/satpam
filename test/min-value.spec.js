'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('MinValue validator', function () {
  var ruleWithParam = {
    favoriteNumber: ['minValue:50']
  };

  it('should success for number type greater or equal to limit', function () {
    var acceptedInputs = [
      50,
      51,
      100
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should success for number as string type greater or equal to limit', function () {
    var acceptedInputs = [
      '50',
      '51',
      '100'
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('favoriteNumber');
    });
  });

  it('should fail for non number', function () {
    var rejectedInputs = [
      '1-1-1+1',
      'asdasd',
      {lol: 'wut'},
      null,
      undefined
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['minValue:$1']).to.equal('Favorite Number must be greater than or equal to 50.');
    });
  });

  it('should fail for number type less than limit', function () {
    var rejectedInputs = [
      49,
      1,
      0,
      -1
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['minValue:$1']).to.equal('Favorite Number must be greater than or equal to 50.');
    });
  });

  it('should fail for number as string type greater than limit', function () {
    var rejectedInputs = [
      '49',
      '1',
      '0',
      '-1'
    ];
    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(ruleWithParam, {favoriteNumber: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('favoriteNumber');
      expect(err.favoriteNumber['minValue:$1']).to.equal('Favorite Number must be greater than or equal to 50.');
    });
  });
});

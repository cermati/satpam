'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('BeginWith validator', function () {
  var objectRules = {
    pet: [
      {
        name: 'beginWith', params: [['dog', 'cat', 'fish']]
      }
    ]
  };

  it('should success for single item', function () {
    var acceptedInputs = [
      'dog',
      'doge',
      'dog kintamani',
      'dog shiba inu',
      'cat woman',
      'fish erman'
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(objectRules, {pet: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pet');
    });
  });

  it('should success for array item', function () {
    var acceptedInputs = [
      [],
      ['dog', 'catherine'],
      ['dog', 'doge', 'dog kintamani', 'dog shiba inu', 'cat woman', 'fish arowana']
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(objectRules, {pet: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pet');
    });
  });

  it('should fail for single item not beginning with string in list', function () {
    var rejectedInputs = [
      '',
      'd',
      'do',
      'dug',
      'dug up',
      'cow',
      'fisx',
      null,
      undefined
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(objectRules, {pet: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['beginWith:$1']).to.equal('Pet must begin with one of dog,cat,fish.');
    });
  });

  it('should fail for array item which contains item not beginning with the string in list', function () {
    var rejectedInputs = [
      ['doge', 'dug'],
      ['dog kintamani', 'd'],
      ['dog kintamani', 'do']
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(objectRules, {pet: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['beginWith:$1']).to.equal('Pet must begin with one of dog,cat,fish.');
    });
  });

  it('should fail for non string or non array of strings', function () {
    var rejectedInputs = [
      ['doge', 'cat', {wild: 'object'}],
      ['dog', 'catherine', 123],
      {wild: 'object'}
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(objectRules, {pet: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['beginWith:$1']).to.equal('Pet must begin with one of dog,cat,fish.');
    });
  });
});

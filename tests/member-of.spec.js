'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('MemberOf validator', function () {
  var objectRules = {
    pet: [
      {
        name: 'memberOf', params: [['dog', 'cat', 'fish']]
      }
    ]
  };

  it('should success for single item', function () {
    var acceptedInputs = [
      'dog',
      'cat',
      'fish'
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
      ['fish'],
      ['dog', 'cat']
    ];

    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(objectRules, {pet: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('pet');
    });
  });

  it('should fail for single item not in the list', function () {
    var rejectedInputs = [
      'shark',
      null,
      undefined
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(objectRules, {pet: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });

  it('should fail for array item which contains item not in the list', function () {
    var rejectedInputs = [
      ['dog', 'cat', 'fish', 'bear'],
      ['shark']
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(objectRules, {pet: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });

  it('should fail for non string or non array of strings', function () {
    var rejectedInputs = [
      ['dog', 'cat', {wild: 'object'}],
      ['dog', 'cat', 123],
      {wild: 'object'}
    ];

    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(objectRules, {pet: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('pet');
      expect(err.pet['memberOf:$1']).to.equal('Pet must be one of dog,cat,fish.');
    });
  });
});

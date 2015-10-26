'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('MinLength validator', function () {
  var ruleWithParam = {
    name: ['minLength:5']
  };

  var acceptedInputs = [
    'abcde',
    'abcd ',
    'wololo',
    'pneumonoultramicroscopicsilicovolcanoconiosis'
  ];

  var rejectedInputs = [
    '',
    'asd',
    'tele'
  ];

  it('should success', function () {
    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(ruleWithParam, {name: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  it('should fail', function () {
    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(ruleWithParam, {name: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
      expect(err.name['minLength:$1']).to.equal('Name must contain at least 5 character(s).');
    });
  });
});

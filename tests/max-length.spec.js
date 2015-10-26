'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('MaxLength validator', function () {
  var ruleWithParam = {
    name: ['maxLength:5']
  };

  var acceptedInputs = [
    'tele',
    'phone',
    '',
    ' woi ',
    '4l@y.'
  ];

  var rejectedInputs = [
    '      ',
    'asdasd',
    'pneumonoultramicroscopicsilicovolcanoconiosis'
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
      expect(err.name['maxLength:$1']).to.equal('Name must not exceed 5 character(s).');
    });
  });
});

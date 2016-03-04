'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('NonBlank validator', function () {
  var simpleRules = {
    name: ['nonBlank']
  };

  var acceptedInputs = [
    'kardus',
    '  bar',
    'vector  ',
    '   a  b  ',
    'newline\n',
    ' \n wild \t \n',
    1214,
    {iAm: 'not simple string'}
  ];

  var rejectedInputs = [
    '',
    '    ',
    ' \n \n \t',
    null,
    undefined
  ];

  it('should success', function () {
    acceptedInputs.forEach(function test(acceptedInput) {
      var result = validator.validate(simpleRules, {name: acceptedInput});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
    });
  });

  it('should fail', function () {
    rejectedInputs.forEach(function test(rejectedInput) {
      var result = validator.validate(simpleRules, {name: rejectedInput});
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
      expect(err.name.nonBlank).to.equal('Name field must not be completely consists of white spaces.');
    });
  });
});

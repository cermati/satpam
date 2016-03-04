'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('String validator', function () {
  var simpleRules = {
    someField: ['string']
  };

  var getTestObject = function () {
    return {
      someField: 'yoyoyo',
    };
  };

  it('should success with valid input', function () {
    var result = validator.validate(simpleRules, getTestObject());
    var err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('someField');
  });

  it('should fail with invalid input', function () {
    var testObj = getTestObject();
    testObj.someField = 123;
    var result = validator.validate(simpleRules, testObj);
    var err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField.string).to.equal('Some Field is not a string.');
  });
});

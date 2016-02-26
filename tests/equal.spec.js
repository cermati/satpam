'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Equal validator', function () {
  var simpleRules = {
    someField: ['equal:pazz']
  };

  var getTestObject = function () {
    return {
      someField: 'pazz',
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
    testObj.someField = 'ya-shall-nat-pazz';
    var result = validator.validate(simpleRules, testObj);
    var err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('someField');
    expect(err.someField['equal:$1']).to.equal('Some Field must equal to pazz.');
  });
});

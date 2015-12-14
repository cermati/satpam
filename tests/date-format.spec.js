'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Date validator', function () {
  var simpleRules = {
    birthday: ['date-format:YYYY-MM-DD']
  };

  var getTestObject = function () {
    return {
      birthday: '1993-09-02',
    };
  };

  it('should success', function () {
    var result = validator.validate(simpleRules, getTestObject());
    var err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('birthday');
  });

  it('should fail', function () {
    var testObj = getTestObject();
    testObj.birthday = '02-09-1993';
    var result = validator.validate(simpleRules, testObj);
    var err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('birthday');
    expect(err.birthday['date-format:$1']).to.equal('Birthday must be in format YYYY-MM-DD.');
  });
});


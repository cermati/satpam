var expect = require('chai').expect;
var validator = require('../');

describe('Date validator', function() {
  var simpleRules = {
    birthday: ['date']
  };

  var getTestObject = function() {
    return {
      birthday: '02-09-1993',
    };
  };

  it('should success', function() {
    var result = validator.validate(simpleRules, getTestObject());
    var err = result.messages;

    expect(result.success).to.equals(true);
    expect(err).to.not.have.property('birthday');
  });

  it('should fail', function() {
    var testObj = getTestObject();
    testObj.birthday = '02--09-1993';
    var result = validator.validate(simpleRules, testObj);
    var err = result.messages;

    expect(result.success).to.equals(false);
    expect(err).to.have.property('birthday');
    expect(err.birthday.date).to.equals('Birthday is not a valid date.');
  });
});

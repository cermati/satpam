var expect = require('chai').expect;
var validator = require('../');

describe('Alpha validator', function() {
  var simpleRules = {
    name: ['alpha']
  };

  var getTestObject = function() {
    return {
      name: 'sendy',
    };
  };

  it('should success', function() {
    var result = validator.validate(simpleRules, getTestObject());
    var err = result.messages;

    expect(result.success).to.equals(true);
    expect(err).to.not.have.property('name');
  });

  it('should fail', function() {
    var testObj = getTestObject();
    testObj.name += '2 hehe';
    var result = validator.validate(simpleRules, testObj);
    var err = result.messages;

    expect(result.success).to.equals(false);
    expect(err).to.have.property('name');
    expect(err.name.alpha).to.equals('Name may only contain letters.');
  });
});

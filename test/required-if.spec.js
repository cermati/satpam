'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Required if validator', function () {
  var simpleRules = {
    address: ['requiredIf:hasHome:Yes']
  };

  var getTestObject = function () {
    return {
      hasHome: 'Yes',
      address: 'somewhere over the rainbow',
    };
  };

  it('should success if hasHome equals to Yes', function () {
    var result = validator.validate(simpleRules, getTestObject());
    var err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
  });

  it('should success if hasHome is undefined', function () {
    var result = validator.validate(simpleRules, {});
    var err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('name');
  });

  it('should fail', function () {
    var input = {
      hasHome: 'Yes'
    };
    var result = validator.validate(simpleRules, input);
    var err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('address');
    expect(err.address['requiredIf:$1:$2']).to.equal('Address field is required.');
  });
});

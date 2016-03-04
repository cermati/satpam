'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Url validator', function () {
  var simpleRules = {
    website: ['url']
  };

  var getTestObject = function () {
    return {
      website: 'https://wikipedia.org',
    };
  };

  it('should success', function () {
    var result = validator.validate(simpleRules, getTestObject());
    var err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('website');
  });

  it('should fail', function () {
    var testObj = getTestObject();
    testObj.website = '02--09-1993';
    var result = validator.validate(simpleRules, testObj);
    var err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('website');
    expect(err.website.url).to.equal('Website is not a valid url.');
  });
});

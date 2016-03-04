'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Credit card validator', function () {
  var simpleRules = {
    cardNumber: ['creditCard']
  };

  var getTestObject = function () {
    return {
      cardNumber: '4111111111111111',
    };
  };

  it('should success', function () {
    var result = validator.validate(simpleRules, getTestObject());
    var err = result.messages;

    expect(result.success).to.equal(true);
    expect(err).to.not.have.property('cardNumber');
  });

  it('should fail', function () {
    var result = validator.validate(simpleRules, {cardNumber: '4111111111111112'});
    var err = result.messages;

    expect(result.success).to.equal(false);
    expect(err).to.have.property('cardNumber');
    expect(err.cardNumber.creditCard).to.equal('Card Number is not a valid credit card number.');
  });
});


'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Mobile mobile phone number validator', function () {
  var rule = {
    phone: ['mobilePhoneNumber']
  };

  context('with empty mobile phone number', function () {
    it('should success', function () {
      var result = validator.validate(rule, {});
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid mobile mobile phone number that starts with 08', function () {
    it('should success', function () {
      var result = validator.validate(rule, {
        phone: '08123456789'
      });

      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid mobile mobile phone number that starts with +628', function () {
    it('should success', function () {
      var result = validator.validate(rule, {
        phone: '+628123456789'
      });

      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with invalid mobile mobile phone number that starts with 812', function () {
    it('should fail', function () {
      var result = validator.validate(rule, {
        phone: '8123456789'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.mobilePhoneNumber)
        .to.equal('Phone field is not a valid mobile phone number.');
    });
  });

  context('with invalid mobile mobile phone number that have 12 numbers after +628', function () {
    it('should fail', function () {
      var result = validator.validate(rule, {
        phone: '+628123456789123'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.mobilePhoneNumber)
        .to.equal('Phone field is not a valid mobile phone number.');
    });
  });

  context('with invalid mobile mobile phone number that 5 numbers after 628', function () {
    it('should fail', function () {
      var result = validator.validate(rule, {
        phone: '62812345'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.mobilePhoneNumber)
        .to.equal('Phone field is not a valid mobile phone number.');
    });
  });
});

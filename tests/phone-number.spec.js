'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Phone number validator', function () {
  var rule = {
    phone: ['phoneNumber']
  };

  context('with valid mobile phone number that starts with 08', function () {
    it('should success', function () {
      var result = validator.validate(rule, {
        phone: '08123456789'
      });

      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid mobile phone number that starts with +628', function () {
    it('should success', function () {
      var result = validator.validate(rule, {
        phone: '+628123456789'
      });

      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid phone number that starts with 021', function () {
    it('should success', function () {
      var result = validator.validate(rule, {
        phone: '+62219837121'
      });

      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with valid phone number that starts with +6221', function () {
    it('should success', function () {
      var result = validator.validate(rule, {
        phone: '+62219837121'
      });

      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('phone');
    });
  });

  context('with invalid phone number that starts with 221', function () {
    it('should fail', function () {
      var result = validator.validate(rule, {
        phone: '2219123123'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });

  context('with invalid mobile phone number that starts with 812', function () {
    it('should fail', function () {
      var result = validator.validate(rule, {
        phone: '8123456789'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });

  context('with invalid mobile phone number that have length 17', function () {
    it('should fail', function () {
      var result = validator.validate(rule, {
        phone: '08123456789123456'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });

  context('with invalid mobile phone number that have length 5', function () {
    it('should fail', function () {
      var result = validator.validate(rule, {
        phone: '02185'
      });

      expect(result.success).to.equal(false);
      expect(result.messages).to.have.property('phone');
      expect(result.messages.phone.phoneNumber)
        .to.equal('Phone field is not a valid phone number.');
    });
  });
});

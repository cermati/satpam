'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Tax ID validator', function () {
  describe('Indonesian Tax Id', function () {
    var simpleRules = {
      myTaxIdNumber: ['taxId:id']
    };

    context('given tax id number', function () {
      context('with invalid length', function () {
        var result = validator.validate(simpleRules, {
          myTaxIdNumber: '1232131'
        });
        var messages = result.messages;

        it('should fail', function () {
          expect(result.success).to.equal(false);
          expect(messages).to.have.property('myTaxIdNumber');
          expect(messages.myTaxIdNumber['taxId:$1']).to.equal('My Tax Id Number is not a valid tax identification number.');
        });
      });

      context('with valid length but with non digit character', function () {
        var result = validator.validate(simpleRules, {
          myTaxIdNumber: '12345678A012345'
        })
        var messages = result.messages;

        it('should fail', function () {
          expect(result.success).to.equal(false);
          expect(messages).to.have.property('myTaxIdNumber');
          expect(messages.myTaxIdNumber['taxId:$1']).to.equal('My Tax Id Number is not a valid tax identification number.');
        });
      });

      context('with invalid tax id number', function () {
        var result = validator.validate(simpleRules, {
          myTaxIdNumber: '123456789012345'
        })
        var messages = result.messages;

        it('should fail', function () {
          expect(result.success).to.equal(false);
          expect(messages).to.have.property('myTaxIdNumber');
          expect(messages.myTaxIdNumber['taxId:$1']).to.equal('My Tax Id Number is not a valid tax identification number.');
        });
      });

      context('with valid tax id number', function () {
        var result = validator.validate(simpleRules, {
          myTaxIdNumber: '012345674123000'
        })
        var messages = result.messages;

        it('should success', function () {
          expect(result.success).to.equal(true);
          expect(messages).to.not.have.property('myTaxIdNumber');
        });
      });
    });
  })
});

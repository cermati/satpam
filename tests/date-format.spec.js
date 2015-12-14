'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Date validator', function () {
  context('given a dateFormat rule with format DD-MM-YYYY', function () {
    var simpleRules = {
      birthday: ['dateFormat:DD-MM-YYYY']
    };

    var getTestObject = function () {
      return {
        birthday: '02-09-1993',
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('birthday');
    });

    it('should fail with format YYYY-MM-DD', function () {
      var testObj = getTestObject();
      testObj.birthday = '1993-09-02';
      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format DD-MM-YYYY.');
    });

    it('should fail with format YYYY-DD-MM', function () {
      var testObj = getTestObject();
      testObj.birthday = '1993-02-09';
      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format DD-MM-YYYY.');
    });

    it('should fail with format DD-MM', function () {
      var testObj = getTestObject();
      testObj.birthday = '02-09';
      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format DD-MM-YYYY.');
    });
  });


  context('given a dateFormat rule with format MM/YYYY', function () {
    var simpleRules = {
      birthday: ['dateFormat:MM/YYYY']
    };

    var getTestObject = function () {
      return {
        birthday: '09/1993',
      };
    };

    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('birthday');
    });

    it('should fail with format YYYY/MM/DD', function () {
      var testObj = getTestObject();
      testObj.birthday = '1993/09/02';
      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format MM/YYYY.');
    });

    it('should fail with format YYYY/MM', function () {
      var testObj = getTestObject();
      testObj.birthday = '2022/12';
      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format MM/YYYY.');
    });

    it('should fail with invalid date', function () {
      var testObj = getTestObject();
      testObj.birthday = '13/2012';
      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('birthday');
      expect(err.birthday['dateFormat:$1']).to.equal('Birthday must be in format MM/YYYY.');
    });
  });
});

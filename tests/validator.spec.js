'use strict';

var expect = require('chai').expect;
var validator = require('../');

describe('Validator', function () {
  var simpleRules = {
    name: ['required'],
    officeEmail: ['required', 'email'],
    officeEmailAdditional: ['email']
  };

  var getTestObject = function () {
    return {
      name: 'sendy',
      officeEmail: 'asd@gg.com'
    };
  };

  describe('Test with simple rules', function () {
    it('should success', function () {
      var result = validator.validate(simpleRules, getTestObject());
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
      expect(err).to.not.have.property('officeEmail');
      expect(err).to.not.have.property('officeEmailAdditional');
    });

    it('should fail with empty name', function () {
      var testObj = getTestObject();
      testObj.name = '';
      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
      expect(err.name.required).to.equal('Name field is required.');
      expect(err.name).to.have.property('required');
      expect(err).to.not.have.property('officeEmail');
      expect(err).to.not.have.property('officeEmailAdditional');
    });

    it('should fail with optionalEmail', function () {
      var testObj = getTestObject();
      testObj.officeEmailAdditional = 'hehe';

      var result = validator.validate(simpleRules, testObj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('officeEmailAdditional');
      expect(err.officeEmailAdditional).to.have.property('email');
      expect(err).to.not.have.property('name');
      expect(err).to.not.have.property('officeEmail');
    });
  });

  describe('Test with custom rules', function () {
    validator.addCustomValidation('must-be-ironman', function (val) {
      return val === 'ironman';
    });

    validator.setValidationMessage('must-be-ironman', 'Not ironman D:');

    var obj = {
      name: 'ironman',
      phone: 123131
    };

    var rules = {
      name: ['required', 'must-be-ironman'],
      phone: ['numeric']
    };

    it('should success', function () {
      var result = validator.validate(rules, obj);
      var err = result.messages;

      expect(result.success).to.equal(true);
      expect(err).to.not.have.property('name');
      expect(err).to.not.have.property('phone');
    });

    it('should fail', function () {
      obj.name = 'sendy';
      var result = validator.validate(rules, obj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err).to.have.property('name');
      expect(err.name['must-be-ironman']).to.equal('Not ironman D:');
      expect(err).to.not.have.property('phone');
      expect(err.messageArray.length).to.equal(1);
      expect(err.messageArray[0]).to.equal('Not ironman D:');
    });
  });

  describe('Test with rule params', function () {
    it('should fail with custom validation range:0:30', function () {
      validator.addCustomValidation('range:$1:$2', function (val, ruleObj) {
        return val >= ruleObj.params[0] && val <= ruleObj.params[1];
      });

      validator.setValidationMessage('range:$1:$2', '<%= propertyName %> must between <%= ruleParams[0] %> and <%= ruleParams[1] %>');

      var obj = { salary: 31 };
      var rules = { salary: ['range:0:30'] };

      var result = validator.validate(rules, obj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.salary['range:$1:$2']).to.equal('Salary must between 0 and 30');
      expect(err.messageArray.length).to.equal(1);
    });
  });

  describe('Test with multiple errors', function () {
    it('should have multiple errors', function () {
      var obj = {
        officeEmail: 'asd@gg.com'
      };

      var rules = {
        name: ['must-equal:sendyhalim'],
        officeEmail: ['email'],
        address: ['must-equal:dimana aja bole', 'required'],
        title: ['required']
      };

      validator.addCustomValidation('must-equal:$1', function (val, ruleObj) {
        return val === ruleObj.params[0];
      });

      validator.setValidationMessage('must-equal:$1', '<%= propertyName %> must equal <%= ruleParams[0] %> !!');

      var result = validator.validate(rules, obj);
      var err = result.messages;

      expect(result.success).to.equal(false);
      expect(err.messageArray.length).to.equal(4);
      expect(err.name['must-equal:$1']).to.equal('Name must equal sendyhalim !!');
      expect(err.address['must-equal:$1']).to.equal('Address must equal dimana aja bole !!');
      expect(err.address['required']).to.equal('Address field is required.');
      expect(err.title['required']).to.equal('Title field is required.');
    });
  });
});

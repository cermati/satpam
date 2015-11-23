'use strict';

var _ = require('lodash');
var required = require('./validators/required');
var email = require('./validators/email');
var numeric = require('./validators/numeric');
var image = require('./validators/image');
var alpha = require('./validators/alpha');
var alphanumeric = require('./validators/alphanumeric');
var date = require('./validators/date');
var url = require('./validators/url');
var string = require('./validators/string');
var nonBlank = require('./validators/non-blank');
var maxLength = require('./validators/max-length');
var minLength = require('./validators/min-length');
var minValue = require('./validators/min-value');
var maxValue = require('./validators/max-value');
var memberOf = require('./validators/member-of');
var beginWith = require('./validators/begin-with');
var regex = require('./validators/regex');
var notEqual = require('./validators/not-equal');

/*
 * Rules should have format:
 * {
 *   name        : ['required']
 *   officeEmail : ['email'],
 *   phone       : ['required', 'numeric']
 * }
 *
 * Example input:
 * { name: 'Sendy', title: 'Lord', officeEmail: 'invalid email', phone: 'hi there123'}
 *
 * messageObj will be like this
 * {
 *   officeEmail: {
 *     email: 'OfficeEmail must be email'
 *   }
 *   phone: {
 *     number: 'Phone must be numeric'
 *   }
 * }
 *
 */

var validation = {
  required: required.validator,
  numeric: numeric.validator,
  email: email.validator,
  image: image.validator,
  alpha: alpha.validator,
  alphanumeric: alphanumeric.validator,
  date: date.validator,
  url: url.validator,
  string: string.validator,
  nonBlank: nonBlank.validator,
  'maxLength:$1': maxLength.validator,
  'minLength:$1': minLength.validator,
  'maxValue:$1': maxValue.validator,
  'minValue:$1': minValue.validator,
  'memberOf:$1': memberOf.validator,
  'beginWith:$1': beginWith.validator,
  'regex:$1:$2': regex.validator,
  'not-equal:$1': notEqual.validator
};

var validationMessages = {
  required: required.message,
  numeric: numeric.message,
  email: email.message,
  image: image.message,
  alpha: alpha.message,
  alphanumeric: alphanumeric.message,
  date: date.message,
  url: url.message,
  string: string.message,
  nonBlank: nonBlank.message,
  'maxValue:$1': maxValue.message,
  'minValue:$1': minValue.message,
  'maxLength:$1': maxLength.message,
  'minLength:$1': minLength.message,
  'memberOf:$1': memberOf.message,
  'beginWith:$1': beginWith.message,
  'regex:$1:$2': regex.message,
  'not-equal:$1': notEqual.message
};

var ValidationMessage = function () {
  this.messageArray = [];
};

/**
 * Create a new validator. When it's created, it will has a cloned (deep) global
 * validation rules and global validation messages. Any changes made to the
 * instance's rules or messages will not affect the global validation rules
 * and messages.
 * @constructor
 */
var Validator = function () {
  this.validation = {
    rules: _.cloneDeep(validation),
    messages: _.cloneDeep(validationMessages)
  };
};


/**
 * @example
 * var ruleMapping = {name: ['required']};
 * var inputObj = {name: ''};
 * var validator = satpam.create();
 * var result = validator.validate(ruleMapping, inputObj);
 *
 * @param ruleMapping - An mapping of input property to the available rules
 *   e.g. {name: ['required', 'alpha']}
 * @param inputObj - Input object to be validated
 * @returns {{result: Boolean, messages: Object}}
 */
Validator.prototype.validate = function (ruleMapping, inputObj) {
  var result = true;
  var messageObj = new ValidationMessage();
  var validator = this;

  // Loop through the given rule mapping
  _.forEach(ruleMapping, function (ruleArray, propertyName) {
    var val = inputObj[propertyName];
    // ruleArray should be something like ['required', 'email']
    ruleArray.forEach(function (rule) {
      var ruleObj = {};

      if (_.isString(rule)) {
        // First variant, everything is embedded as string
        var splitted = rule.split(':');
        ruleObj = {
          // Property fullName is the generic full name of validation rule
          // e.g range:1:3 -> range:$1:$2, required -> required
          fullName: _.first(splitted),

          // Get only the first part of full rule e.g if range:1:3 then
          // we will get 'range'
          name: _.first(splitted),

          // Get the rule params if e.g range:1:3 -> [1, 3]
          params: splitted.slice(1)
        };
      } else {
        // Second variant, it is already parsed
        ruleObj.name = rule.name;
        ruleObj.fullName = rule.name;
        ruleObj.params = rule.params;
      }

      ruleObj.fullName = ruleObj.params.reduce(function (ruleName, val, index) {
        return ruleName + ':$' + (index + 1).toString();
      }, ruleObj.fullName);


      var validationRuleFn = validator.validation.rules[ruleObj.fullName];
      var validationResult = validationRuleFn(val, ruleObj, propertyName, inputObj);

      if (!validationResult) {
        result = false;

        // Set messageObj initial value
        messageObj[propertyName] = messageObj[propertyName] || {};

        // Set the validation message
        var msg = validator.getValidationMessage(ruleObj, propertyName, val);
        messageObj[propertyName][ruleObj.fullName] = msg;
        messageObj.messageArray.push(msg);
      }
    });
  });

  return {
    success: result,
    messages: messageObj
  };
};

/**
 * @param ruleObj
 * @param propertyName
 * @param val
 * @returns {String}
 */
Validator.prototype.getValidationMessage = function (ruleObj, propertyName, val) {
  var compiled = _.template(this.validation.messages[ruleObj.fullName]);
  propertyName = _.startCase(propertyName);

  return compiled({
    propertyName: propertyName,
    ruleName: ruleObj.fullName,
    ruleParams: ruleObj.params,
    value: val
  });
};

/**
 * Add custom validation the validator instance, it will only affect the
 * validator instance, if you want to add global validation rule then use
 * addCustomValidation method on satpam module.
 *   var satpam = require('satpam');
 *   satpam.addCustomValidation(.., ..);
 *
 * @param ruleName
 * @param validationFunction
 */
Validator.prototype.addCustomValidation = function (ruleName, validateFunction) {
  this.validation.rules[ruleName] = validateFunction;
};


/**
 * Set validation message for the given ruleName, it will only affect the
 * validator instance(the receiver), if you want to set global validation
 * message then use addCustomValidation method on satpam module.
 *   var satpam = require('satpam');
 *   satpam.setValidationMessage(.., ..);
 * @param ruleName
 * @param message
 */
Validator.prototype.setValidationMessage = function (ruleName, message) {
  this.validation.messages[ruleName] = message;
};


/**
 * Create new Validator instance, will have validations and validation messages
 * that is cloned from the global validations and validation messages.
 * @returns Validator - Satpam validator instance
 */
exports.create = function () {
  return new Validator();
};

/**
 * @example
 * var ruleMapping = {name: ['required']};
 * var inputObj = {name: ''};
 * var validator = satpam.create();
 * var result = validator.validate(ruleMapping, inputObj);
 *
 * @param ruleMapping - An mapping of input property to the available rules
 *   e.g. {name: ['required', 'alpha']}
 * @param inputObj - Input object to be validated
 * @returns {{result: Boolean, messages: Object}}
 */
exports.validate = function (ruleMapping, inputObj) {
  var validator = new Validator();
  return validator.validate(ruleMapping, inputObj);
};

/**
 * Add custom validation the validator instance, it will only affect the
 * validator instance, if you want to add global validation rule then use
 * addCustomValidation method on satpam module.
 *   var satpam = require('satpam');
 *   satpam.addCustomValidation(.., ..);
 *
 * @param ruleName
 * @param validationFunction
 */
exports.addCustomValidation = function (ruleName, validationFunction) {
  validation[ruleName] = validationFunction;
};

/**
 * Set validation message for the given ruleName, it will only affect the
 * validator instance(the receiver), if you want to set global validation
 * message then use addCustomValidation method on satpam module.
 *   var satpam = require('satpam');
 *   satpam.setValidationMessage(.., ..);
 * @param ruleName
 * @param message
 */
exports.setValidationMessage = function (ruleName, message) {
  validationMessages[ruleName] = message;
};

/**
 * The global validation object that contains all of the validation rules
 * @type {object}
 */
exports.validation = validation;

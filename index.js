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


var validations = {
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
  'regex:$1:$2': regex.validator
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
  'regex:$1:$2': regex.message
};

var ValidationMessage = function () {
  this.messageArray = [];
};

var Validator = function () {

};

Validator.prototype.validation = {
  rules: validations,
  messages: validationMessages
};

Validator.prototype.validate = function (rules, obj) {
  var result = true;
  var messageObj = new ValidationMessage();
  var validator = this;

  // Loop through the given rules
  _.forEach(rules, function (ruleArray, propertyName) {
    var val = obj[propertyName];
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
      var validationResult = validationRuleFn(val, ruleObj, propertyName, obj);

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

exports = module.exports = {
  create: function () {
    return new Validator();
  },
  validate: function (rules, obj) {
    var validator = new Validator();
    return validator.validate(rules, obj);
  },
  validations: validations,
  addCustomValidation: function (ruleName, fn) {
    validations[ruleName] = fn;
  },
  setValidationMessage: function (ruleName, message) {
    validationMessages[ruleName] = message;
  }
};

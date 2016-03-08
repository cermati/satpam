import _ from 'lodash/fp';

import required from './validators/required';
import email from './validators/email';
import numeric from './validators/numeric';
import image from './validators/image';
import alpha from './validators/alpha';
import alphanumeric from './validators/alphanumeric';
import date from './validators/date';
import url from './validators/url';
import string from './validators/string';
import nonBlank from './validators/non-blank';
import maxLength from './validators/max-length';
import minLength from './validators/min-length';
import minValue from './validators/min-value';
import maxValue from './validators/max-value';
import memberOf from './validators/member-of';
import beginWith from './validators/begin-with';
import regex from './validators/regex';
import notEqual from './validators/not-equal';
import equal from './validators/equal';
import dateFormat from './validators/date-format';
import dateAfter from './validators/date-after';
import dateBefore from './validators/date-before';
import creditCard from './validators/credit-card';
import requiredIf from './validators/required-if';
import taxId from './validators/tax-id';
import phoneNumber from './validators/phone-number';
import mobilePhoneNumber from './validators/mobile-phone-number';
import objectId from './validators/object-id';

let validation = {
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
  creditCard: creditCard.validator,
  phoneNumber: phoneNumber.validator,
  mobilePhoneNumber: mobilePhoneNumber.validator,
  objectId: objectId.validator,
  'maxLength:$1': maxLength.validator,
  'minLength:$1': minLength.validator,
  'maxValue:$1': maxValue.validator,
  'minValue:$1': minValue.validator,
  'memberOf:$1': memberOf.validator,
  'beginWith:$1': beginWith.validator,
  'regex:$1:$2': regex.validator,
  'not-equal:$1': notEqual.validator,
  'equal:$1': equal.validator,
  'dateFormat:$1': dateFormat.validator,
  'dateAfter:$1:$2:$3:$4': dateAfter.validator,
  'dateBefore:$1:$2:$3:$4': dateBefore.validator,
  'requiredIf:$1:$2': requiredIf.validator,
  'taxId:$1': taxId.validator
};

let validationMessages = {
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
  creditCard: creditCard.message,
  phoneNumber: phoneNumber.message,
  mobilePhoneNumber: mobilePhoneNumber.message,
  objectId: objectId.message,
  'maxValue:$1': maxValue.message,
  'minValue:$1': minValue.message,
  'maxLength:$1': maxLength.message,
  'minLength:$1': minLength.message,
  'memberOf:$1': memberOf.message,
  'beginWith:$1': beginWith.message,
  'regex:$1:$2': regex.message,
  'not-equal:$1': notEqual.message,
  'equal:$1': equal.message,
  'dateFormat:$1': dateFormat.message,
  'dateAfter:$1:$2:$3:$4': dateAfter.message,
  'dateBefore:$1:$2:$3:$4': dateBefore.message,
  'requiredIf:$1:$2': requiredIf.message,
  'taxId:$1': taxId.message
};

class ValidationMessage {
  constructor() {
    this.messageArray = [];
  }
}

/**
 * Create a new validator. When it's created, it will has a cloned (deep) global
 * validation rules and global validation messages. Any changes made to the
 * instance's rules or messages will not affect the global validation rules
 * and messages.
 * @constructor
 */
class Validator {
  constructor() {
    this.validation = {
      rules: _.cloneDeep(validation),
      messages: _.cloneDeep(validationMessages)
    };
  }

  /**
   * Create a rule object based on the given rule.
   * @param rule {Object|String}
   * @returns {{name: String, fullName: String, params: Array<String>}}
   */
  _createRuleObject(rule) {
    let ruleObj = {};

    if (_.isString(rule)) {
      // First variant, everything is embedded as string
      const splitted = rule.split(':');

      // Get only the first part of full rule e.g if range:1:3 then
      // we will get 'range'
      ruleObj.name = _.first(splitted);
      // Get the rule params if e.g range:1:3 -> [1, 3]
      ruleObj.params = splitted.slice(1);
    } else {
      // Second variant, it is already parsed (Object)
      ruleObj.name = rule.name;
      ruleObj.params = rule.params || [];
    }

    // Property fullName is the generic full name of validation rule
    // e.g range:1:3 -> range:$1:$2, required -> required
    ruleObj.fullName = ruleObj.params.reduce((ruleName, val, index) => {
      return ruleName + ':$' + (index + 1).toString();
    }, ruleObj.name);

    return ruleObj;
  }


  /**
   * @example
   *   const ruleMapping = {name: ['required']};
   *   const inputObj = {name: ''};
   *   const validator = satpam.create();
   *   const result = validator.validate(ruleMapping, inputObj);
   *
   * @param ruleMapping - An mapping of input property to the available rules
   *   e.g. {name: ['required', 'alpha']}
   * @param inputObj - Input object to be validated
   * @returns {{result: Boolean, messages: Object}}
   */
  validate(ruleMapping, inputObj) {
    const validator = this;
    let result = true;
    let messageObj = new ValidationMessage();

    // Loop through the given rule mapping
    _.forEach((ruleArray, propertyName) => {
      const val = inputObj[propertyName];

      // Rule array should be something like ['required', 'email']
      ruleArray.forEach(rule => {
        const ruleObj = this._createRuleObject(rule);
        const validationRuleFn = validator.validation.rules[ruleObj.fullName];
        const validationResult = validationRuleFn(val, ruleObj, propertyName, inputObj);

        if (!validationResult) {
          result = false;

          // Set messageObj initial value
          messageObj[propertyName] = messageObj[propertyName] || {};

          // Set the validation message
          const msg = validator.getValidationMessage(ruleObj, propertyName, val);
          messageObj[propertyName][ruleObj.fullName] = msg;
          messageObj.messageArray.push(msg);
        }
      });
    }, ruleMapping);

    return {
      success: result,
      messages: messageObj
    };
  }


  /**
   * @param ruleObj
   * @param propertyName
   * @param val
   * @returns {String}
   */
  getValidationMessage(ruleObj, propertyName, val) {
    const compiled = _.template(this.validation.messages[ruleObj.fullName]);
    propertyName = _.startCase(propertyName);

    return compiled({
      propertyName: propertyName,
      ruleName: ruleObj.fullName,
      ruleParams: ruleObj.params,
      value: val
    });
  }


  /**
   * Add custom validation the validator instance, it will only affect the
   * validator instance, if you want to add global validation rule then use
   * addCustomValidation method on satpam module.
   *
   * @example
   *   import satpam from 'satpam';
   *   satpam.addCustomValidation(.., ..);
   *
   * @param ruleName
   * @param validationFunction
   */
  addCustomValidation(ruleName, validateFunction) {
    this.validation.rules[ruleName] = validateFunction;
  }

  /**
   * Set validation message for the given ruleName, it will only affect the
   * validator instance(the receiver), if you want to set global validation
   * message then use addCustomValidation method on satpam module.
   *
   * @example
   *   import satpam from 'satpam';
   *   satpam.setValidationMessage(.., ..);
   *
   * @param ruleName
   * @param message
   */
  setValidationMessage(ruleName, message) {
    this.validation.messages[ruleName] = message;
  }
}

/**
 * Create new Validator instance, will have validations and validation messages
 * that is cloned from the global validations and validation messages.
 * @returns Validator - Satpam validator instance
 */
exports.create = () => new Validator();

/**
 * @example
 *   const ruleMapping = {name: ['required']};
 *   const inputObj = {name: ''};
 *   const validator = satpam.create();
 *   const result = validator.validate(ruleMapping, inputObj);
 *
 * @param ruleMapping - An mapping of input property to the available rules
 *   e.g. {name: ['required', 'alpha']}
 * @param inputObj - Input object to be validated
 * @returns {{result: Boolean, messages: Object}}
 */
exports.validate = (ruleMapping, inputObj) => {
  const validator = new Validator();
  return validator.validate(ruleMapping, inputObj);
};

/**
 * Add custom validation the validator instance, it will only affect the
 * validator instance, if you want to add global validation rule then use
 * addCustomValidation method on satpam module.
 *
 * @example
 *   import satpam from 'satpam';
 *   satpam.addCustomValidation(.., ..);
 *
 * @param ruleName
 * @param validationFunction
 */
exports.addCustomValidation = (ruleName, validationFunction) => {
  validation[ruleName] = validationFunction;
};

/**
 * Set validation message for the given ruleName, it will only affect the
 * validator instance(the receiver), if you want to set global validation
 * message then use addCustomValidation method on satpam module.
 *
 * @example
 *   import satpam from 'satpam';
 *   satpam.setValidationMessage(.., ..);
 *
 * @param ruleName
 * @param message
 */
exports.setValidationMessage = (ruleName, message) => {
  validationMessages[ruleName] = message;
};

/**
 * The global validation object that contains all of the validation rules
 * @type {object}
 */
exports.validation = validation;

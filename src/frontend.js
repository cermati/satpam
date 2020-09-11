import always from 'ramda/src/always';
import any from 'ramda/src/any';
import clone from 'ramda/src/clone';
import head from 'ramda/src/head';
import is from 'ramda/src/is';
import keys from 'ramda/src/keys';
import prop from 'ramda/src/prop';

import get from 'lodash/get';
import isArray from 'lodash/isArray';
import template from 'lodash/template';
import startCase from 'lodash/startCase';

import alpha from './validators/alpha';
import alphanumeric from './validators/alphanumeric';
import array from './validators/array';
import beginWith from './validators/begin-with';
import between from './validators/between';
import boolean from './validators/boolean';
import creditCard from './validators/credit-card';
import date from './validators/date';
import dateAfter from './validators/date-after';
import dateAfterOrEqual from './validators/date-after-or-equal';
import dateBefore from './validators/date-before';
import dateBeforeOrEqual from './validators/date-before-or-equal';
import dateFormat from './validators/date-format';
import email from './validators/email';
import emptyString from './validators/empty-string';
import equal from './validators/equal';
import equalToField from './validators/equal-to-field';
import fqdn from './validators/fqdn';
import indonesiaIdCardNumberBirthDate from './validators/indonesia-id-card-number-birth-date';
import indonesiaIdCardNumberGender from './validators/indonesia-id-card-number-gender';
import indonesianName from './validators/indonesian-name';
import ip from './validators/ip';
import imei from './validators/imei';
import integer from './validators/integer';
import length from './validators/length';
import maxLength from './validators/max-length';
import maxValue from './validators/max-value';
import memberOf from './validators/member-of';
import minLength from './validators/min-length';
import minValue from './validators/min-value';
import minimumAge from './validators/minimum-age';
import mobilePhoneNumber from './validators/mobile-phone-number';
import mongoId from './validators/mongo-id';
import nonBlank from './validators/non-blank';
import notDisposableEmail from './validators/not-disposable-email';
import notEqual from './validators/not-equal';
import notEqualToField from './validators/not-equal-to-field';
import notMemberOf from './validators/not-member-of';
import numeric from './validators/numeric';
import pattern from './validators/pattern';
import phoneNumber from './validators/phone-number';
import regex from './validators/regex';
import required from './validators/required';
import requiredIf from './validators/required-if';
import requiredIfNot from './validators/required-if-not';
import string from './validators/string';
import taxId from './validators/tax-id';
import url from './validators/url';

let validation = {
  'beginWith:$1': beginWith.validate,
  'between:$1:$2': between.validate,
  'dateAfter:$1:$2:$3:$4': dateAfter.validate,
  'dateAfterOrEqual:$1:$2:$3:$4': dateAfterOrEqual.validate,
  'dateBefore:$1:$2:$3:$4': dateBefore.validate,
  'dateBeforeOrEqual:$1:$2:$3:$4': dateBeforeOrEqual.validate,
  'dateFormat:$1': dateFormat.validate,
  'equal:$1': equal.validate,
  'equal-to-field:$1': equalToField.validate,
  'indonesiaIdCardNumberBirthDate:$1:$2': indonesiaIdCardNumberBirthDate.validate,
  'indonesiaIdCardNumberGender:$1:$2:$3': indonesiaIdCardNumberGender.validate,
  'indonesianName': indonesianName.validate,
  'length:$1': length.validate,
  'maxLength:$1': maxLength.validate,
  'maxValue:$1': maxValue.validate,
  'memberOf:$1': memberOf.validate,
  'minLength:$1': minLength.validate,
  'minValue:$1': minValue.validate,
  'minimumAge:$1:$2': minimumAge.validate,
  'not-equal:$1': notEqual.validate,
  'not-equal-to-field:$1': notEqualToField.validate,
  'not-memberOf:$1': notMemberOf.validate,
  'pattern:$1:$2': pattern.validate,
  'requiredIf:$1:$2': requiredIf.validate,
  'requiredIfNot:$1:$2': requiredIfNot.validate,
  'taxId:$1': taxId.validate,
  alpha: alpha.validate,
  alphanumeric: alphanumeric.validate,
  array: array.validate,
  boolean: boolean.validate,
  creditCard: creditCard.validate,
  date: date.validate,
  email: email.validate,
  emptyString: emptyString.validate,
  fqdn: fqdn.validate,
  ip: ip.validate,
  imei: imei.validate,
  integer: integer.validate,
  mobilePhoneNumber: mobilePhoneNumber.validate,
  mongoId: mongoId.validate,
  nonBlank: nonBlank.validate,
  numeric: numeric.validate,
  phoneNumber: phoneNumber.validate,
  regex: regex.validate,
  required: required.validate,
  string: string.validate,
  url: url.validate,
};

let validationMessages = {
  'beginWith:$1': beginWith.message,
  'between:$1:$2': between.message,
  'dateAfter:$1:$2:$3:$4': dateAfter.message,
  'dateAfterOrEqual:$1:$2:$3:$4': dateAfterOrEqual.message,
  'dateBefore:$1:$2:$3:$4': dateBefore.message,
  'dateBeforeOrEqual:$1:$2:$3:$4': dateBeforeOrEqual.message,
  'dateFormat:$1': dateFormat.message,
  'equal:$1': equal.message,
  'equal-to-field:$1': equalToField.message,
  'indonesiaIdCardNumberBirthDate:$1:$2': indonesiaIdCardNumberBirthDate.message,
  'indonesiaIdCardNumberGender:$1:$2:$3': indonesiaIdCardNumberGender.message,
  'indonesianName': indonesianName.message,
  'length:$1': length.message,
  'maxLength:$1': maxLength.message,
  'maxValue:$1': maxValue.message,
  'memberOf:$1': memberOf.message,
  'minLength:$1': minLength.message,
  'minValue:$1': minValue.message,
  'minimumAge:$1:$2': minimumAge.message,
  'not-equal:$1': notEqual.message,
  'not-equal-to-field:$1': notEqualToField.message,
  'not-memberOf:$1': notMemberOf.message,
  'pattern:$1:$2': pattern.message,
  'requiredIf:$1:$2': requiredIf.message,
  'requiredIfNot:$1:$2': requiredIfNot.message,
  'taxId:$1': taxId.message,
  alpha: alpha.message,
  alphanumeric: alphanumeric.message,
  array: array.message,
  boolean: boolean.message,
  creditCard: creditCard.message,
  date: date.message,
  email: email.message,
  emptyString: emptyString.message,
  fqdn: fqdn.message,
  ip: ip.message,
  imei: imei.message,
  integer: integer.message,
  mobilePhoneNumber: mobilePhoneNumber.message,
  mongoId: mongoId.message,
  notDisposableEmail: notDisposableEmail.validate,
  nonBlank: nonBlank.message,
  numeric: numeric.message,
  phoneNumber: phoneNumber.message,
  regex: regex.message,
  required: required.message,
  string: string.message,
  url: url.message,
};

class ValidationMessage {
  constructor() { }
}

/**
 * Create a new validator. When it's created, it will have a deep cloned global
 * validation rules and global validation messages. Any changes made to the
 * instance's rules or messages will not affect the global validation rules
 * and messages.
 * @constructor
 */
class Validator {
  constructor() {
    this.validation = {
      rules: clone(validation),
      messages: clone(validationMessages)
    };
  }

  /**
   * Create a rule object based on the given rule.
   * @param rule {Object|String}
   * @returns {{name: String, fullName: String, params: Array<String>, shouldValidate: Function}}
   */
  _createRuleObject(rule) {
    let ruleObj = {};

    if (is(String, rule)) {
      // First variant, everything is embedded as string
      const splitted = rule.split(':');

      // Get only the first part of full rule e.g if range:1:3 then
      // we will get 'range'
      ruleObj.name = head(splitted);
      // Get the rule params if e.g range:1:3 -> [1, 3]
      ruleObj.params = splitted.slice(1);
    } else {
      // Second variant, it is already parsed (Object)
      ruleObj.name = rule.name;
      ruleObj.fullName = rule.fullName;
      ruleObj.params = rule.params || [];
      ruleObj.shouldValidate = rule.shouldValidate;
    }

    ruleObj.shouldValidate = ruleObj.shouldValidate || always(true);

    if (!ruleObj.fullName) {
      // Property fullName is the generic full name of validation rule
      // e.g range:1:3 -> range:$1:$2, required -> required
      ruleObj.fullName = ruleObj.params.reduce((ruleName, val, index) => {
        return ruleName + ':$' + (index + 1).toString();
      }, ruleObj.name);
    }

    return ruleObj;
  }

  /**
   * This function is for validating the `inputObj` based on the given `ruleMapping`.
   * We need this function because `_validate` function will be called recursively
   * if there's a nested rule mappings, there's a case when we need the `rootInputObj`.
   * That's why we're separating the public API `validate` with this function which contains
   * all the heavy logic of coordinating validation rules.
   *
   * @param ruleMapping - An mapping of input property to the available rules
   *   e.g. {name: ['required', 'alpha']}
   * @param inputObj - Input object to be validated
   * @param rootInputObj - The root input object to be validated started from the top "tree" of input object.
   * @returns {{result: Boolean, messages: Object}}
   */
  _validate(ruleMapping, inputObj, rootInputObj) {
    const validator = this;
    let result = true;
    let messageObj = new ValidationMessage();

    // Loop through the given rule mapping
    keys(ruleMapping).forEach(propertyName => {
      const ruleArray = ruleMapping[propertyName];
      const val = get(inputObj, propertyName);
      const setValidationMessage = (ruleName, message) => {
        // Set messageObj initial value
        messageObj[propertyName] = messageObj[propertyName] || {};
        messageObj[propertyName][ruleName] = message;
      };

      const _validate = rule => {
        const ruleObj = this._createRuleObject(rule);
        const validate = validator.validation.rules[ruleObj.fullName];

        if (!ruleObj.shouldValidate(ruleObj, rootInputObj)) {
          return {
            success: true,
            ruleName: ruleObj.fullName,
            message: ''
          };
        }

        if (!is(Function, validate)) {
          const ruleObjString = JSON.stringify(ruleObj);
          throw new Error(`${ruleObj.fullName} is not a valid satpam validation rule. Rule object: ${ruleObjString}`);
        }

        const validationResult = validate(val, ruleObj, propertyName, inputObj);

        if (!validationResult) {
          return {
            success: false,
            ruleName: ruleObj.fullName,
            message: validator.getValidationMessage(ruleObj, propertyName, val)
          }
        }

        return {
          success: true,
          ruleName: ruleObj.fullName,
          message: ''
        };
      };

      // Nested rule
      if (!isArray(ruleArray)) {
        const nestedResult = this._validate(
          ruleArray,
          get(inputObj, propertyName),
          rootInputObj
        );
        result = nestedResult.success && result;

        if (!nestedResult.success) {
          // Merge the result
          messageObj[propertyName] = nestedResult.messages;
        }
      } else {
        // Rule array should be something like ['required', 'email']
        ruleArray.forEach(rule => {
          // We will validate and return true if any of the rule passes
          if (is(Array, rule)) {
            const resultObjects = rule.map(_validate);
            const overallResult = any(prop('success'), resultObjects);

            // If none of the results is true then it
            if (!overallResult) {
              result = false;
              resultObjects.forEach(resultObj => {
                setValidationMessage(resultObj.ruleName, resultObj.message);
              });
            }
          } else {
            const resultObj = _validate(rule);

            if (!resultObj.success) {
              result = false;
              setValidationMessage(resultObj.ruleName, resultObj.message);
            }
          }
        });

      }
    });

    return {
      success: result,
      messages: messageObj
    };
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
    return this._validate(ruleMapping, inputObj, inputObj);
  }

  /**
   * @param ruleObj
   * @param propertyName
   * @param val
   * @returns {String}
   */
  getValidationMessage(ruleObj, propertyName, val) {
    const message = this.validation.messages[ruleObj.fullName];
    const messageTemplate = is(Function, message) ? message(ruleObj, propertyName, val) : message;
    const compiled = template(messageTemplate);
    propertyName = startCase(propertyName);

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

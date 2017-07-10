import R from 'ramda';
import _ from 'lodash';

import required from './validators/required';
import email from './validators/email';
import numeric from './validators/numeric';
import image from './validators/image';
import alpha from './validators/alpha';
import alphanumeric from './validators/alphanumeric';
import date from './validators/date';
import url from './validators/url';
import ip from './validators/ip';
import fqdn from './validators/fqdn';
import string from './validators/string';
import nonBlank from './validators/non-blank';
import length from './validators/length';
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
import mongoId from './validators/mongo-id';
import minimumAge from './validators/minimum-age';
import fileType from './validators/file-type';
import boolean from './validators/boolean';
import between from './validators/between';
import indonesiaIdCardNumberBirthDate from './validators/indonesia-id-card-number-birth-date';

let validation = {
  'beginWith:$1': beginWith.validate,
  'between:$1:$2': between.validate,
  'dateAfter:$1:$2:$3:$4': dateAfter.validate,
  'dateBefore:$1:$2:$3:$4': dateBefore.validate,
  'dateFormat:$1': dateFormat.validate,
  'equal:$1': equal.validate,
  'fileType:$1': fileType.validate,
  'indonesiaIdCardNumberBirthDate:$1:$2': indonesiaIdCardNumberBirthDate.validate,
  'length:$1': length.validate,
  'maxLength:$1': maxLength.validate,
  'maxValue:$1': maxValue.validate,
  'memberOf:$1': memberOf.validate,
  'minLength:$1': minLength.validate,
  'minValue:$1': minValue.validate,
  'minimumAge:$1:$2': minimumAge.validate,
  'not-equal:$1': notEqual.validate,
  'regex:$1:$2': regex.validate,
  'requiredIf:$1:$2': requiredIf.validate,
  'taxId:$1': taxId.validate,
  alpha: alpha.validate,
  alphanumeric: alphanumeric.validate,
  boolean: boolean.validate,
  creditCard: creditCard.validate,
  date: date.validate,
  email: email.validate,
  fqdn: fqdn.validate,
  image: image.validate,
  ip: ip.validate,
  mobilePhoneNumber: mobilePhoneNumber.validate,
  mongoId: mongoId.validate,
  nonBlank: nonBlank.validate,
  numeric: numeric.validate,
  phoneNumber: phoneNumber.validate,
  required: required.validate,
  string: string.validate,
  url: url.validate
};

let validationMessages = {
  'beginWith:$1': beginWith.message,
  'between:$1:$2': between.message,
  'dateAfter:$1:$2:$3:$4': dateAfter.message,
  'dateBefore:$1:$2:$3:$4': dateBefore.message,
  'dateFormat:$1': dateFormat.message,
  'equal:$1': equal.message,
  'fileType:$1': fileType.message,
  'indonesiaIdCardNumberBirthDate:$1:$2': indonesiaIdCardNumberBirthDate.message,
  'length:$1': length.message,
  'maxLength:$1': maxLength.message,
  'maxValue:$1': maxValue.message,
  'memberOf:$1': memberOf.message,
  'minLength:$1': minLength.message,
  'minValue:$1': minValue.message,
  'minimumAge:$1:$2': minimumAge.message,
  'not-equal:$1': notEqual.message,
  'regex:$1:$2': regex.message,
  'requiredIf:$1:$2': requiredIf.message,
  'taxId:$1': taxId.message,
  alpha: alpha.message,
  alphanumeric: alphanumeric.message,
  boolean: boolean.message,
  creditCard: creditCard.message,
  date: date.message,
  email: email.message,
  fqdn: fqdn.message,
  image: image.message,
  ip: ip.message,
  mobilePhoneNumber: mobilePhoneNumber.message,
  mongoId: mongoId.message,
  nonBlank: nonBlank.message,
  numeric: numeric.message,
  phoneNumber: phoneNumber.message,
  required: required.message,
  string: string.message,
  url: url.message
};

class ValidationMessage {
  constructor() { }
}

/**
 * A custom implementation of lodash clone deep.
 * We're using this because current version of lodash's cloneDeep does not
 * clone Function. It's fixed in lodash 4.17.* as far as I know, but we'll use this
 * until we upgrade lodash :beers:
 *
 * @author Sendy Halim <sendy@cermati.com>
 * @param {Object} obj
 * @returns {Object}
 */
const cloneDeep = obj => {
  const newObj = {};

  _.forEach(obj, (value, key) => {
    if (_.isObject(value) && !_.isFunction(value)) {
      newObj[key] = cloneDeep(value);
    }

    newObj[key] = value;
  });

  return newObj;
};

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
      rules: R.clone(validation),
      messages: cloneDeep(validationMessages)
    };
  }

  /**
   * Create a rule object based on the given rule.
   * @param rule {Object|String}
   * @returns {{name: String, fullName: String, params: Array<String>, shouldValidate: Function}}
   */
  _createRuleObject(rule) {
    let ruleObj = {};

    if (R.is(String, rule)) {
      // First variant, everything is embedded as string
      const splitted = rule.split(':');

      // Get only the first part of full rule e.g if range:1:3 then
      // we will get 'range'
      ruleObj.name = R.head(splitted);
      // Get the rule params if e.g range:1:3 -> [1, 3]
      ruleObj.params = splitted.slice(1);
    } else {
      // Second variant, it is already parsed (Object)
      ruleObj.name = rule.name;
      ruleObj.fullName = rule.fullName;
      ruleObj.params = rule.params || [];
      ruleObj.shouldValidate = rule.shouldValidate;
    }

    ruleObj.shouldValidate = ruleObj.shouldValidate || R.always(true);

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
    R.keys(ruleMapping).forEach(propertyName => {
      const ruleArray = ruleMapping[propertyName];
      const val = _.get(inputObj, propertyName);
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

        if (!R.is(Function, validate)) {
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
      if (!_.isArray(ruleArray)) {
        const nestedResult = this._validate(
          ruleArray,
          _.get(inputObj, propertyName),
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
          if (R.is(Array, rule)) {
            const resultObjects = rule.map(_validate);
            const overallResult = R.any(R.prop('success'), resultObjects);

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
    const messageTemplate = R.is(Function, message) ? message(ruleObj, propertyName, val) : message;
    const compiled = _.template(messageTemplate);
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

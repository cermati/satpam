import R from 'ramda';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import template from 'lodash/template';
import startCase from 'lodash/startCase';
import isNil from 'lodash/isNil';
import reduce from 'lodash/reduce';

import noes from 'noes';

import alpha from './validators/alpha';
import alphanumeric from './validators/alphanumeric';
import array from './validators/array';
import beginWith from './validators/begin-with';
import between from './validators/between';
import boolean from './validators/boolean';
import containsAlphabet from './validators/contains-alphabet';
import containsDigit from './validators/contains-digit';
import containsLowerCase from './validators/contains-lower-case';
import containsSymbol from './validators/contains-symbol';
import containsUpperCase from './validators/contains-upper-case';
import creditCard from './validators/credit-card';
import date from './validators/date';
import dateAfter from './validators/date-after';
import dateAfterOrEqual from './validators/date-after-or-equal';
import dateBefore from './validators/date-before';
import dateBeforeOrEqual from './validators/date-before-or-equal';
import dateFormat from './validators/date-format';
import dateTimeAfter from './validators/date-time-after';
import dateTimeAfterOrEqual from './validators/date-time-after-or-equal';
import dateTimeBefore from './validators/date-time-before';
import dateTimeBeforeOrEqual from './validators/date-time-before-or-equal';
import email from './validators/email';
import emptyString from './validators/empty-string';
import equal from './validators/equal';
import equalToField from './validators/equal-to-field';
import fileType from './validators/file-type';
import fqdn from './validators/fqdn';
import hostname from './validators/hostname';
import image from './validators/image';
import imei from './validators/imei';
import indonesiaIdCardNumberBirthDate from './validators/indonesia-id-card-number-birth-date';
import indonesiaIdCardNumberGender from './validators/indonesia-id-card-number-gender';
import indonesiaIdCardNumberProvince from './validators/indonesia-id-card-number-province';
import indonesiaIdCardNumberValidProvince from './validators/indonesia-id-card-number-valid-province';
import indonesianName from './validators/indonesian-name';
import integer from './validators/integer';
import internationalPhoneNumber from './validators/international-phone-number';
import ip from './validators/ip';
import length from './validators/length';
import maxLength from './validators/max-length';
import maxValue from './validators/max-value';
import memberOf from './validators/member-of';
import minLength from './validators/min-length';
import minValue from './validators/min-value';
import minimumAge from './validators/minimum-age';
import mobilePhoneNumber from './validators/mobile-phone-number';
import mongoId from './validators/mongo-id';
import multipleOf from './validators/multiple-of';
import nonBlank from './validators/non-blank';
import notDisposableEmail from './validators/not-disposable-email';
import notEqual from './validators/not-equal';
import notEqualToField from './validators/not-equal-to-field';
import notEqualEmailDomain from './validators/not-equal-email-domain';
import notMemberOf from './validators/not-member-of';
import numeric from './validators/numeric';
import pattern from './validators/pattern';
import phoneNumber from './validators/phone-number';
import plainObject from './validators/plain-object';
import regex from './validators/regex';
import required from './validators/required';
import requiredIf from './validators/required-if';
import requiredIfNot from './validators/required-if-not';
import someMemberOf from './validators/some-member-of';
import string from './validators/string';
import taxId from './validators/tax-id';
import timeAfter from './validators/time-after';
import timeAfterOrEqual from './validators/time-after-or-equal';
import timeBefore from './validators/time-before';
import timeBeforeOrEqual from './validators/time-before-or-equal';
import url from './validators/url';
import urlProtocol from './validators/url-protocol';
import uuid from './validators/uuid';

let validators = [
  alpha,
  alphanumeric,
  array,
  beginWith,
  between,
  boolean,
  containsAlphabet,
  containsDigit,
  containsLowerCase,
  containsSymbol,
  containsUpperCase,
  creditCard,
  date,
  dateAfter,
  dateAfterOrEqual,
  dateBefore,
  dateBeforeOrEqual,
  dateTimeAfter,
  dateTimeAfterOrEqual,
  dateTimeBefore,
  dateTimeBeforeOrEqual,
  dateFormat,
  email,
  emptyString,
  equal,
  equalToField,
  fileType,
  fqdn,
  hostname,
  image,
  imei,
  indonesiaIdCardNumberBirthDate,
  indonesiaIdCardNumberGender,
  indonesiaIdCardNumberProvince,
  indonesiaIdCardNumberValidProvince,
  indonesianName,
  integer,
  internationalPhoneNumber,
  ip,
  length,
  maxLength,
  maxValue,
  memberOf,
  minLength,
  minValue,
  minimumAge,
  mobilePhoneNumber,
  mongoId,
  multipleOf,
  nonBlank,
  notDisposableEmail,
  notEqual,
  notEqualToField,
  notEqualEmailDomain,
  notMemberOf,
  numeric,
  pattern,
  phoneNumber,
  plainObject,
  regex,
  required,
  requiredIf,
  requiredIfNot,
  someMemberOf,
  string,
  taxId,
  timeAfter,
  timeAfterOrEqual,
  timeBefore,
  timeBeforeOrEqual,
  url,
  urlProtocol,
  uuid
];

/**
 * Validation by validator full name
 * @example
 * {
 *   [alpha.fullName]: alpha.validate,
 *   [alphanumeric.fullName]: alphanumeric.validate,
 *   ...
 * }
 */
let validation = reduce(
  validators,
  (result, validator) => {
    result[validator.fullName] = validator.validate;

    return result;
  },
  {}
);

/**
 * Validation message by validator full name
 * @example
 * {
 *   [alpha.fullName]: alpha.message,
 *   [alphanumeric.fullName]: alphanumeric.message,
 *   ...
 * }
 */
let validationMessages = reduce(
  validators,
  (result, validator) => {
    result[validator.fullName] = validator.message;

    return result;
  },
  {}
);

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

  forEach(obj, (value, key) => {
    if (isObject(value) && !isFunction(value)) {
      newObj[key] = cloneDeep(value);
    }

    newObj[key] = value;
  });

  return newObj;
};

/**
 * Default validation message formatter
 */
const defaultValidationMessageParamsFormatter = ({ propertyName, violatedRule }) => {
  return {
    ruleParams: violatedRule.params,
    propertyName: startCase(propertyName)
  };
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
   * @returns {{name: String, fullName: String, params: Array<String>, shouldValidate: Function|ConjunctionObject}}
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

      if (R.is(Object, rule.shouldValidate) && noes.Conjunction.shouldCreateConjunction(rule.shouldValidate)) {
        ruleObj.shouldValidate = (ruleObj, rootInputObj) => {
          return noes.create(rule.shouldValidate).satisfied(rootInputObj);
        };
      } else {
        ruleObj.shouldValidate = rule.shouldValidate;
      }
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
  _validate(ruleMapping, inputObj, rootInputObj, options) {
    const validator = this;
    let result = true;
    let messageObj = new ValidationMessage();

    // Loop through the given rule mapping
    R.keys(ruleMapping).forEach(propertyName => {
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

        if (!R.is(Function, validate)) {
          const ruleObjString = JSON.stringify(ruleObj);
          throw new Error(`${ruleObj.fullName} is not a valid satpam validation rule. Rule object: ${ruleObjString}`);
        }

        const validationResult = validate(val, ruleObj, propertyName, inputObj);

        if (!validationResult) {
          return {
            success: false,
            ruleName: ruleObj.fullName,
            message: validator.getValidationMessage( // TODO: Refactor to use RoRo (BREAKING CHANGE)
              ruleObj,
              propertyName,
              val,
              inputObj,
              options
            )
          };
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
          rootInputObj,
          options
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
  validate(ruleMapping, inputObj, options) {
    return this._validate(ruleMapping, inputObj, inputObj, options);
  }

  /**
   * @param ruleObj
   * @param propertyName
   * @param val
   * @param inputObj
   * @param [options]
   * @param [options.messageFormatter]
   * @returns {String}
   */
  getValidationMessage(ruleObj, propertyName, val, inputObj, options) {
    options = R.mergeDeepLeft(options, {
      validationMessageParamsFormatter: defaultValidationMessageParamsFormatter,
      validationMessagePackProvider: () => this.validation.messages
    });

    const validationMessagePack = options.validationMessagePackProvider({
      propertyName,
      inputObj,
      violatedRule: ruleObj
    });

    const ruleFullName = ruleObj.fullName;

    // Not all message pack provider, if passed, would be guaranted to cover
    // all of the validation messages. So we're still providing default validation message.
    const message = validationMessagePack[ruleFullName] || this.validation.messages[ruleFullName];
    const messageTemplate = R.is(Function, message) ? message(ruleObj, propertyName, val) : message;

    const compiled = template(messageTemplate);

    const formatted = options.validationMessageParamsFormatter({
      propertyName,
      propertyValue: val,
      inputObj: inputObj,
      violatedRule: ruleObj
    });

    const formattedRuleParams = formatted.ruleParams;

    // Some additional checking
    if (get(formattedRuleParams, 'length') !== ruleObj.params.length) {
      throw new Error(
        'Formatted rule params length does not match original params length, are you missing something? Formatted rule params:' + JSON.stringify(formattedRuleParams)
      );
    }

    return compiled({
      inputObj: inputObj,
      propertyName: isNil(formatted.propertyName) ? startCase(propertyName) : formatted.propertyName,
      ruleName: ruleFullName,
      ruleParams: formattedRuleParams,
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

  /**
   * Set validation message using locale file
   *
   * @example
   *   import satpam from 'satpam';
   *   satpam.setValidationLocale(..);
   *
   * @param locale
   */
  setValidationLocale(locale) {
    try {
      const localeMapping = require(`./locale/${R.toLower(locale)}`);

      for (const key of R.keys(localeMapping)) {
        this.setValidationMessage(key, localeMapping[key]);
      }
    } catch (error) {
      throw new Error('Locale not found.');
    }
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
exports.validate = (ruleMapping, inputObj, options) => {
  const validator = new Validator();

  return validator.validate(ruleMapping, inputObj, options);
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
 * Set validation message locale
 *
 * @example
 *   import satpam from 'satpam';
 *   satpam.setValidationLocale(..);
 *
 * @param locale
 */
exports.setValidationLocale = (locale) => {
  try {
    const localeMapping = require(`./locale/${R.toLower(locale)}`);

    for (const key of R.keys(localeMapping)) {
      validationMessages[key] = localeMapping[key];
    }
  } catch (error) {
    throw new Error('Locale not found.');
  }
};

/**
 * The global validation object that contains all of the validation rules
 * @type {object}
 */
exports.validation = validation;

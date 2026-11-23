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

import allowedFileType from './validators/allowed-file-type';
import alpha from './validators/alpha';
import alphanumeric from './validators/alphanumeric';
import anyBeginWith from './validators/any-begin-with';
import anyBeginWithCaseInsensitive from './validators/any-begin-with-case-insensitive';
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
import fileExtension from './validators/file-extension';
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
import json from './validators/json';
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
import mustInclude from './validators/must-include';
import nonBlank from './validators/non-blank';
import nonBlankItems from './validators/non-blank-items';
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
import mustHaveAllPrefixes from './validators/must-have-all-prefixes';
import iso8601Duration from './validators/iso-8601-duration';
import iso8601MinDuration from './validators/iso-8601-min-duration';
import iso8601MaxDuration from './validators/iso-8601-max-duration';
import maxArraySize from './validators/max-array-size';
import minArraySize from './validators/min-array-size';

let validators = [
  allowedFileType,
  alpha,
  alphanumeric,
  anyBeginWith,
  anyBeginWithCaseInsensitive,
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
  fileExtension,
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
  iso8601Duration,
  iso8601MinDuration,
  iso8601MaxDuration,
  json,
  length,
  maxArraySize,
  minArraySize,
  maxLength,
  maxValue,
  memberOf,
  minLength,
  minValue,
  minimumAge,
  mobilePhoneNumber,
  mongoId,
  multipleOf,
  mustHaveAllPrefixes,
  mustInclude,
  nonBlank,
  nonBlankItems,
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
 * Whether a rule handed back a promise-like value instead of a plain pass/fail.
 *
 * Duck-typed on `then` rather than `instanceof Promise`, because a rule may return a Bluebird
 * or other non-native promise.
 *
 * @param {*} value
 * @returns {Boolean}
 */
const isThenable = value => !isNil(value) && isFunction(value.then);


/**
 * Create a new validator. By default it will have a deep cloned global
 * validation rules and global validation messages. Any changes made to the
 * instance's rules or messages will not affect the global validation rules
 * and messages.
 *
 * With `shareGlobalRules: true` the instance reads the global rules and messages
 * directly instead of cloning them. Only use it for an instance that never calls
 * `addCustomValidation` / `setValidationMessage` on itself, otherwise those calls
 * would mutate the global maps.
 *
 * @constructor
 * @param {Object} [options]
 * @param {Boolean} [options.shareGlobalRules=false]
 */
class Validator {
  constructor({ shareGlobalRules = false } = {}) {
    this.validation = shareGlobalRules
      ? {
        rules: validation,
        messages: validationMessages
      }
      : {
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
   * Run a single rule against a value and return what the rule function returned, untouched.
   *
   * Split out of `_validate` so the sync and async walks share one definition of "running a rule":
   * the only thing they differ on is whether they await `outcome` before reading it.
   *
   * A rule skipped by `shouldValidate` reports `true`, which is how `_validate` has always
   * treated it.
   *
   * @param {Object} param
   * @param {Object|String} param.rule
   * @param {*} param.val
   * @param {String} param.propertyName
   * @param {Object} param.inputObj
   * @param {Object} param.rootInputObj
   * @returns {{ruleObj: Object, outcome: *}}
   */
  _runRule({ rule, val, propertyName, inputObj, rootInputObj }) {
    const ruleObj = this._createRuleObject(rule);
    const validate = this.validation.rules[ruleObj.fullName];

    if (!ruleObj.shouldValidate(ruleObj, rootInputObj)) {
      return { ruleObj, outcome: true };
    }

    if (!R.is(Function, validate)) {
      const ruleObjString = JSON.stringify(ruleObj);
      throw new Error(`${ruleObj.fullName} is not a valid satpam validation rule. Rule object: ${ruleObjString}`);
    }

    return {
      ruleObj,
      outcome: validate(val, ruleObj, propertyName, inputObj)
    };
  }

  /**
   * Turn a rule's settled outcome into the result object `_validate` aggregates.
   *
   * Kept separate from `_runRule` because the message must only be built once the outcome is
   * known, which for an async rule is after it resolves.
   *
   * @param {Object} param
   * @param {Object} param.ruleObj
   * @param {*} param.outcome - truthy means the rule passed
   * @param {*} param.val
   * @param {String} param.propertyName
   * @param {Object} param.inputObj
   * @param {Object} [param.options]
   * @returns {{success: Boolean, ruleName: String, message: String}}
   */
  _toRuleResult({ ruleObj, outcome, val, propertyName, inputObj, options }) {
    if (!outcome) {
      return {
        success: false,
        ruleName: ruleObj.fullName,
        message: this.getValidationMessage( // TODO: Refactor to use RoRo (BREAKING CHANGE)
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
        const { ruleObj, outcome } = this._runRule({
          rule,
          val,
          propertyName,
          inputObj,
          rootInputObj
        });

        // A promise is always truthy, so reading it here would pass the rule no matter what it
        // later resolves to. Fail loudly instead and point the caller at the API that awaits it.
        if (isThenable(outcome)) {
          throw new Error(`${ruleObj.fullName} is an async satpam validation rule, use validateAsync instead of validate.`);
        }

        return this._toRuleResult({
          ruleObj,
          outcome,
          val,
          propertyName,
          inputObj,
          options
        });
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
   * Async counterpart of `_validate`: same walk over the rule mapping, but every rule's outcome is
   * awaited before it is read, so rules may return a promise.
   *
   * Properties are walked one at a time so `messages` gets its keys in the same order `_validate`
   * produces. The rules of a single property are started together, then their settled results are
   * read back in rule order, so messages come out identical to `_validate` whichever rule finishes
   * first.
   *
   * A rule that throws or rejects rejects the whole call rather than counting as a failed rule,
   * matching how a throwing rule escapes `_validate`.
   *
   * @param ruleMapping - An mapping of input property to the available rules
   * @param inputObj - Input object to be validated
   * @param rootInputObj - The root input object, passed down unchanged through nested mappings
   * @param [options]
   * @returns {Promise<{success: Boolean, messages: Object}>}
   */
  async _validateAsync(ruleMapping, inputObj, rootInputObj, options) {
    let result = true;
    const messageObj = new ValidationMessage();

    for (const propertyName of R.keys(ruleMapping)) {
      const ruleArray = ruleMapping[propertyName];
      const val = get(inputObj, propertyName);
      const setValidationMessage = (ruleName, message) => {
        messageObj[propertyName] = messageObj[propertyName] || {};
        messageObj[propertyName][ruleName] = message;
      };

      const _validate = async rule => {
        const { ruleObj, outcome } = this._runRule({
          rule,
          val,
          propertyName,
          inputObj,
          rootInputObj
        });

        // Awaiting a plain boolean is a no-op, so sync rules need no special casing here
        const settledOutcome = await outcome;

        return this._toRuleResult({
          ruleObj,
          outcome: settledOutcome,
          val,
          propertyName,
          inputObj,
          options
        });
      };

      if (!isArray(ruleArray)) {
        // Nested rule
        const nestedResult = await this._validateAsync(
          ruleArray,
          val,
          rootInputObj,
          options
        );
        result = nestedResult.success && result;

        if (!nestedResult.success) {
          messageObj[propertyName] = nestedResult.messages;
        }
      } else {
        const settledResults = await Promise.all(ruleArray.map(rule => {
          // An inner array is an any-of group: it passes if any one of its rules passes
          if (R.is(Array, rule)) {
            return Promise.all(rule.map(_validate));
          }

          return _validate(rule);
        }));

        ruleArray.forEach((rule, index) => {
          const settled = settledResults[index];

          if (R.is(Array, rule)) {
            const overallResult = R.any(R.prop('success'), settled);

            if (!overallResult) {
              result = false;
              settled.forEach(resultObj => {
                setValidationMessage(resultObj.ruleName, resultObj.message);
              });
            }

            return;
          }

          if (!settled.success) {
            result = false;
            setValidationMessage(settled.ruleName, settled.message);
          }
        });
      }
    }

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
   * Like `validate`, but supports rules that return a promise. Sync rules work here too, so a
   * rule mapping can mix both.
   *
   * @example
   *   const validator = satpam.create();
   *   const result = await validator.validateAsync(ruleMapping, inputObj);
   *
   * @param ruleMapping - An mapping of input property to the available rules
   *   e.g. {document: ['required', {name: 'allowedFileType', params: [['image/png']]}]}
   * @param inputObj - Input object to be validated
   * @param [options]
   * @returns {Promise<{success: Boolean, messages: Object}>}
   */
  validateAsync(ruleMapping, inputObj, options) {
    return this._validateAsync(ruleMapping, inputObj, inputObj, options);
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
 * Validator used by the stateless `satpam.validate()`.
 *
 * `satpam.validate()` used to create a new Validator per call, deep cloning ~80 global
 * rules and messages and throwing the copy away right after (~8-10 us per call, 75-95%
 * of the cost of a typical validation). `validate()` keeps no state on the instance, so
 * one instance that reads the global maps directly gives the same result. Rules and
 * messages added later through `satpam.addCustomValidation` / `satpam.setValidationMessage`
 * / `satpam.setValidationLocale` are still picked up, exactly as the per-call clone did.
 */
const sharedValidator = new Validator({ shareGlobalRules: true });

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
  return sharedValidator.validate(ruleMapping, inputObj, options);
};

/**
 * @example
 *   const result = await satpam.validateAsync(ruleMapping, inputObj);
 *
 * @param ruleMapping - An mapping of input property to the available rules
 * @param inputObj - Input object to be validated
 * @param [options]
 * @returns {Promise<{success: Boolean, messages: Object}>}
 */
exports.validateAsync = (ruleMapping, inputObj, options) => {
  return sharedValidator.validateAsync(ruleMapping, inputObj, options);
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

import alpha from '../validators/alpha';
import alphanumeric from '../validators/alphanumeric';
import array from '../validators/array';
import beginWith from '../validators/begin-with';
import between from '../validators/between';
import boolean from '../validators/boolean';
import containsAlphabet from '../validators/contains-alphabet';
import containsDigit from '../validators/contains-digit';
import containsLowerCase from '../validators/contains-lower-case';
import containsSymbol from '../validators/contains-symbol';
import containsUpperCase from '../validators/contains-upper-case';
import creditCard from '../validators/credit-card';
import date from '../validators/date';
import dateAfter from '../validators/date-after';
import dateAfterOrEqual from '../validators/date-after-or-equal';
import dateBefore from '../validators/date-before';
import dateBeforeOrEqual from '../validators/date-before-or-equal';
import dateTimeAfter from '../validators/date-time-after';
import dateTimeAfterOrEqual from '../validators/date-time-after-or-equal';
import dateTimeBefore from '../validators/date-time-before';
import dateTimeBeforeOrEqual from '../validators/date-time-before-or-equal';
import dateFormat from '../validators/date-format';
import email from '../validators/email';
import emptyString from '../validators/empty-string';
import equal from '../validators/equal';
import equalToField from '../validators/equal-to-field';
import fileType from '../validators/file-type';
import fqdn from '../validators/fqdn';
import hostname from '../validators/hostname';
import image from '../validators/image';
import imei from '../validators/imei';
import indonesiaIdCardNumberBirthDate from '../validators/indonesia-id-card-number-birth-date';
import indonesiaIdCardNumberGender from '../validators/indonesia-id-card-number-gender';
import indonesiaIdCardNumberProvince from '../validators/indonesia-id-card-number-province';
import indonesiaIdCardNumberValidProvince from '../validators/indonesia-id-card-number-valid-province';
import indonesianName from '../validators/indonesian-name';
import integer from '../validators/integer';
import internationalPhoneNumber from '../validators/international-phone-number';
import ip from '../validators/ip';
import length from '../validators/length';
import maxLength from '../validators/max-length';
import maxValue from '../validators/max-value';
import memberOf from '../validators/member-of';
import minLength from '../validators/min-length';
import minValue from '../validators/min-value';
import minimumAge from '../validators/minimum-age';
import mobilePhoneNumber from '../validators/mobile-phone-number';
import mongoId from '../validators/mongo-id';
import multipleOf from '../validators/multiple-of';
import nonBlank from '../validators/non-blank';
import notDisposableEmail from '../validators/not-disposable-email';
import notEqual from '../validators/not-equal';
import notEqualToField from '../validators/not-equal-to-field';
import notEqualEmailDomain from '../validators/not-equal-email-domain';
import notMemberOf from '../validators/not-member-of';
import numeric from '../validators/numeric';
import pattern from '../validators/pattern';
import phoneNumber from '../validators/phone-number';
import plainObject from '../validators/plain-object';
import regex from '../validators/regex';
import required from '../validators/required';
import requiredIf from '../validators/required-if';
import requiredIfNot from '../validators/required-if-not';
import someMemberOf from '../validators/some-member-of';
import string from '../validators/string';
import taxId from '../validators/tax-id';
import timeAfter from '../validators/time-after';
import timeAfterOrEqual from '../validators/time-after-or-equal';
import timeBefore from '../validators/time-before';
import timeBeforeOrEqual from '../validators/time-before-or-equal';
import url from '../validators/url';
import urlProtocol from '../validators/url-protocol';
import uuid from '../validators/uuid';

import Validator from './validator';
import reduce from 'lodash/reduce';

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
  dateFormat,
  dateTimeAfter,
  dateTimeAfterOrEqual,
  dateTimeBefore,
  dateTimeBeforeOrEqual,
  dateFormat,
  dateTimeAfter,
  dateTimeAfterOrEqual,
  dateTimeBefore,
  dateTimeBeforeOrEqual,
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
  notEqualEmailDomain,
  notEqualToField,
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
  uuid,
]

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

/**
 * Create new Validator instance, will have validations and validation messages
 * that is cloned from the global validations and validation messages.
 * @returns Validator - Satpam validator instance
 */
exports.create = () => new Validator({
  rules: validation,
  messages: validationMessages,
});

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
  const validator = new Validator({
    rules: validation,
    messages: validationMessages,
  });

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

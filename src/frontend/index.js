import alpha from '../validators/alpha';
import alphanumeric from '../validators/alphanumeric';
import array from '../validators/array';
import beginWith from '../validators/begin-with';
import between from '../validators/between';
import boolean from '../validators/boolean';
import creditCard from '../validators/credit-card';
import date from '../validators/date';
import dateAfter from '../validators/date-after';
import dateAfterOrEqual from '../validators/date-after-or-equal';
import dateBefore from '../validators/date-before';
import dateBeforeOrEqual from '../validators/date-before-or-equal';
import dateFormat from '../validators/date-format';
import dateTimeAfter from '../validators/date-time-after';
import dateTimeAfterOrEqual from '../validators/date-time-after-or-equal';
import email from '../validators/email';
import emptyString from '../validators/empty-string';
import equal from '../validators/equal';
import equalToField from '../validators/equal-to-field';
import fqdn from '../validators/fqdn';
import indonesiaIdCardNumberBirthDate from '../validators/indonesia-id-card-number-birth-date';
import indonesiaIdCardNumberGender from '../validators/indonesia-id-card-number-gender';
import indonesiaIdCardNumberProvince from '../validators/indonesia-id-card-number-province';
import indonesiaIdCardNumberValidProvince from '../validators/indonesia-id-card-number-valid-province';
import indonesianName from '../validators/indonesian-name';
import ip from '../validators/ip';
import imei from '../validators/imei';
import integer from '../validators/integer';
import length from '../validators/length';
import maxLength from '../validators/max-length';
import maxValue from '../validators/max-value';
import memberOf from '../validators/member-of';
import minLength from '../validators/min-length';
import minValue from '../validators/min-value';
import minimumAge from '../validators/minimum-age';
import mobilePhoneNumber from '../validators/mobile-phone-number';
import mongoId from '../validators/mongo-id';
import nonBlank from '../validators/non-blank';
import notDisposableEmail from '../validators/not-disposable-email';
import notEqual from '../validators/not-equal';
import notEqualToField from '../validators/not-equal-to-field';
import notEqualEmailDomain from '../validators/not-equal-email-domain';
import notMemberOf from '../validators/not-member-of';
import numeric from '../validators/numeric';
import pattern from '../validators/pattern';
import phoneNumber from '../validators/phone-number';
import regex from '../validators/regex';
import required from '../validators/required';
import requiredIf from '../validators/required-if';
import requiredIfNot from '../validators/required-if-not';
import someMemberOf from '../validators/some-member-of';
import string from '../validators/string';
import taxId from '../validators/tax-id';
import url from '../validators/url';

import Validator from './validator';
import reduce from 'lodash/reduce';

let validators = [
  alpha,
  alphanumeric,
  array,
  beginWith,
  between,
  boolean,
  creditCard,
  date,
  dateAfter,
  dateAfterOrEqual,
  dateBefore,
  dateBeforeOrEqual,
  dateFormat,
  dateTimeAfter,
  dateTimeAfterOrEqual,
  email,
  emptyString,
  equal,
  equalToField,
  fqdn,
  indonesiaIdCardNumberBirthDate,
  indonesiaIdCardNumberGender,
  indonesiaIdCardNumberProvince,
  indonesiaIdCardNumberValidProvince,
  indonesianName,
  ip,
  imei,
  integer,
  length,
  maxLength,
  maxValue,
  memberOf,
  minLength,
  minValue,
  minimumAge,
  mobilePhoneNumber,
  mongoId,
  nonBlank,
  notDisposableEmail,
  notEqual,
  notEqualToField,
  notEqualEmailDomain,
  notMemberOf,
  numeric,
  pattern,
  phoneNumber,
  regex,
  required,
  requiredIf,
  requiredIfNot,
  someMemberOf,
  string,
  taxId,
  url
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

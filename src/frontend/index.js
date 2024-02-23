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

let validation = {
  'beginWith:$1': beginWith.validate,
  'between:$1:$2': between.validate,
  'dateAfter:$1:$2:$3:$4': dateAfter.validate,
  'dateAfterOrEqual:$1:$2:$3:$4': dateAfterOrEqual.validate,
  'dateBefore:$1:$2:$3:$4': dateBefore.validate,
  'dateBeforeOrEqual:$1:$2:$3:$4': dateBeforeOrEqual.validate,
  'dateFormat:$1': dateFormat.validate,
  'dateTimeAfter:$1:$2:$3:$4': dateTimeAfter.validate,
  'dateTimeAfterOrEqual:$1:$2:$3:$4': dateTimeAfterOrEqual.validate,
  'equal:$1': equal.validate,
  'equal-to-field:$1': equalToField.validate,
  'indonesiaIdCardNumberBirthDate:$1:$2': indonesiaIdCardNumberBirthDate.validate,
  'indonesiaIdCardNumberGender:$1:$2:$3': indonesiaIdCardNumberGender.validate,
  'indonesiaIdCardNumberProvince:$1': indonesiaIdCardNumberProvince.validate,
  'indonesiaIdCardNumberValidProvince': indonesiaIdCardNumberValidProvince.validate,
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
  'not-equal-email-domain:$1': notEqualEmailDomain.validate,
  'not-memberOf:$1': notMemberOf.validate,
  'pattern:$1:$2': pattern.validate,
  'requiredIf:$1:$2': requiredIf.validate,
  'requiredIfNot:$1:$2': requiredIfNot.validate,
  'some-memberOf:$1': someMemberOf.validate,
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
  'dateTimeAfter:$1:$2:$3:$4': dateTimeAfter.message,
  'dateTimeAfterOrEqual:$1:$2:$3:$4': dateTimeAfterOrEqual.message,
  'equal:$1': equal.message,
  'equal-to-field:$1': equalToField.message,
  'indonesiaIdCardNumberBirthDate:$1:$2': indonesiaIdCardNumberBirthDate.message,
  'indonesiaIdCardNumberGender:$1:$2:$3': indonesiaIdCardNumberGender.message,
  'indonesiaIdCardNumberProvince:$1': indonesiaIdCardNumberProvince.message,
  'indonesiaIdCardNumberValidProvince': indonesiaIdCardNumberValidProvince.message,
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
  'not-equal-email-domain:$1': notEqualEmailDomain.message,
  'not-memberOf:$1': notMemberOf.message,
  'pattern:$1:$2': pattern.message,
  'requiredIf:$1:$2': requiredIf.message,
  'requiredIfNot:$1:$2': requiredIfNot.message,
  'some-memberOf:$1': someMemberOf.message,
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

'use strict';

/**
 * Validate credit card number.
 * This is a modified version of github.com/chriso/validator.js `isCreditCard`,
 * the difference is this version does not run the creditcard regex test, some
 * valid credit card numbers in Indonesia does not pass the regex test.
 * https://github.com/chriso/validator.js/blob/master/validator.js#L604
 *
 * @author Sendy Halim <sendyhalim93@gmail.com>
 * @param str
 * @returns {Boolean}
 */
var validateCreditCard = function (str) {
  var sanitized = str.replace(/[^0-9]+/g, '');
  var sum = 0, digit, tmpNum, shouldDouble;
  for (var i = sanitized.length - 1; i >= 0; i--) {
    digit = sanitized.substring(i, (i + 1));
    tmpNum = parseInt(digit, 10);
    if (shouldDouble) {
      tmpNum *= 2;
      if (tmpNum >= 10) {
        sum += ((tmpNum % 10) + 1);
      } else {
        sum += tmpNum;
      }
    } else {
      sum += tmpNum;
    }
    shouldDouble = !shouldDouble;
  }
  return !!((sum % 10) === 0 ? sanitized : false);
};

exports = module.exports = {
  validator: function (val) {
    if (val) {
      return validateCreditCard(val);
    }

    return true;
  },
  message: '<%= propertyName %> is not a valid credit card number.'
};

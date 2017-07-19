/**
 * Validate IMEI number.
 * The core logic is copied from https://github.com/madeinstefano/imei-validator/blob/gh-pages/imei.js
 *
 * @param value
 * @returns {Boolean}
 */
const validate = value => {
  if (!value) {
    return true;
  }

  if (!/^[0-9]{15}$/.test(value)) {
    return false;
  }

  let sum = 0;
  let factor = 2;
  let checkDigit, multipliedDigit;

  for (var i = 13, li = 0; i >= li; i--) {
    multipliedDigit = parseInt(value.charAt(i), 10) * factor;
    sum += (multipliedDigit >= 10 ? ((multipliedDigit % 10) + 1) : multipliedDigit);
    (factor === 1 ? factor++ : factor--);
  }
  checkDigit = ((10 - (sum % 10)) % 10);

  return !(checkDigit !== parseInt(value.charAt(14), 10))
};

const message = '<%= propertyName %> is not a valid IMEI.';

export default {validate, message};

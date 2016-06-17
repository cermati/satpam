import R from 'ramda';

const hasNonDigit = R.any(isNaN);
const STRATEGY = {
  id: 'id' // Indonesia
};

/**
 * Check if the given value is a valid Indonesian tax identification number.
 * http://excelku.com/2014/12/06/rumus-excel-menguji-validitas-npwp
 *
 * @param {String} value
 * @returns {Boolean}
 */
const validateIndonesianTaxId = value => {
  const digits = value.split('');

  // Indonesian Tax Id must have 15 digits numbers
  if (digits.length !== 15) {
    return false;
  }

  const firstEightDigits = digits.slice(0, 8);

  if (hasNonDigit(firstEightDigits)) {
    return false;
  }

  const total = firstEightDigits.reduce(function (acc, x, index) {
    const oneBasedIndex = index + 1;
    const isEvenIndex = oneBasedIndex % 2 === 0;
    const y = isEvenIndex ? (x * 2) : x;

    return acc + parseInt(y / 10, 10) + parseInt(y % 10, 10);
  }, 0);

  const ninthDigit = Number(digits[8]);
  const roundedToNearestTen = Math.ceil(total / 10) * 10;

  return (roundedToNearestTen - total) === ninthDigit;
}

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  const strategy = ruleObj.params[0];
  const stringValue = String(val);

  switch (strategy) {
  case STRATEGY.id: return validateIndonesianTaxId(stringValue);

  default:
    throw new Error(
      'Could not found tax id validation strategy for the given strategy: %s',
      strategy
    );
  }
};

const message = '<%= propertyName %> is not a valid tax identification number.';

export default {validate, message};

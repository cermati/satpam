'use strict';

var _ = require('lodash');

var STRATEGY = {
  id: 'id' // Indonesia
};


/**
 * Check if the given value is a valid Indonesian tax identification number.
 * http://excelku.com/2014/12/06/rumus-excel-menguji-validitas-npwp
 *
 * @param {String} value
 * @returns {Boolean}
 */
function validateIndonesianTaxId(value) {
  var digits = value.split('');

  debugger;
  // Indonesian Tax Id must have 15 digits numbers
  if (digits.length !== 15) {
    return false;
  }

  var firstEightDigits = digits.slice(0, 8);

  if (_.some(firstEightDigits, isNaN)) {
    return false;
  }

  var total = firstEightDigits.reduce(function (acc, x, index) {
    var oneBasedIndex = index + 1;
    var isEvenIndex = oneBasedIndex % 2 === 0;
    var y = isEvenIndex ? (x * 2) : x;

    return acc + parseInt(y / 10, 10) + parseInt(y % 10, 10);
  }, 0);

  var ninthDigit = Number(digits[8]);
  var roundedToNearestTen = Math.ceil(total / 10) * 10;

  return (roundedToNearestTen - total) === ninthDigit;
}

module.exports = {
  validator: function (val, ruleObj) {
    if (!val) {
      return true;
    }

    var strategy = ruleObj.params[0];
    var stringValue = String(val);

    switch (strategy) {
      case STRATEGY.id: return validateIndonesianTaxId(stringValue);

      default:
        throw new Error(
          'Could not found tax id validation strategy for the given strategy: %s',
          strategy
        );
      }
  },
  message: '<%= propertyName %> is not a valid tax identification number.'
};

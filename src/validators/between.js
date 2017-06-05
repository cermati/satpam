import R from 'ramda';

/**
 * Check if the given value is between minimum value and maximum value
 *
 * @param {String} value to be checked
 * @param {String[]} ruleObj.params
 * @param {String} ruleObj.params[0] - Minimum Value
 * @param {String} ruleObj.params[1] - Maximum Value
 * @returns {Boolean}
 */
const validate = (val, ruleObj) => {
  if (R.isNil(val)) {
    return false;
  }

  const valAsNumber = R.is(Number, val) ? val : Number(val);

  if (isNaN(valAsNumber)) {
    return false;
  }

  return valAsNumber > Number(ruleObj.params[0]) && valAsNumber < Number(ruleObj.params[1]);
};

const message = '<%= propertyName %> must be greater than <%= ruleParams[0] %> and less than <%= ruleParams[1] %>.';

export default {validate, message};

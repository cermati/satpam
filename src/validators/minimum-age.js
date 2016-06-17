import R from 'ramda';
import moment from 'moment';

import {InvalidValidationRuleParameter} from '../data-structures/errors';

const message = 'Minimum age is <%= ruleParams[0] %> years old.';

/**
 * Check if the given dateString satisfy the minimum or maximum age relative
 * from now.
 *
 * @author Sendy Halim <sendyhalim93@gmail.com>
 * @param {String} dateString
 * @param {String} ruleObj.name
 * @param {String} ruleObj.fullName
 * @param {String[]} ruleObj.params
 * @param {String} ruleObj.params[0] - Minimum age
 * @param {String} ruleObj.params[1] - Date format for the given dateString
 * @returns {Boolean}
 */
const validate = (dateString, ruleObj) => {
  const minimumAge = Number(ruleObj.params[0]);

  if (!R.is(Number, minimumAge)) {
    throw new InvalidValidationRuleParameter(minimumAge);
  }

  const dateInputFormat = ruleObj.params[1];
  const today = moment();
  const birthDate = moment(dateString, dateInputFormat);
  const age = today.diff(birthDate, 'years');

  return age > (minimumAge - 1);
};

export default {validate, message};

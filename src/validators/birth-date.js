import _ from 'lodash/fp';
import moment from 'moment';

import {InvalidValidationRuleParameter} from '../data-structures/errors';

const message = 'Minimum age is <%= ruleParams[0] %> years old.';

const validate = (val, ruleObj) => {
  const minimumAge = Number(ruleObj.params[0]);

  if (!_.isNumber(minimumAge)) {
    throw new InvalidValidationRuleParameter(minimumAge);
  }

  const dateInputFormat = ruleObj.params[1];
  const today = moment();
  const birthDate = moment(val, dateInputFormat);
  const age = today.diff(birthDate, 'years');

  return age > (minimumAge - 1);
};

export default {validate, message};

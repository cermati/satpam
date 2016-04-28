import _ from 'lodash/fp';
import required from './required';
import conjunction from '../data-structures/conjunction';

const validate = (val, ruleObj, propertyName, inputObj) => {
  const params = ruleObj.params;
  const targetProperty = conjunction.Conjunction.shouldCreateConjunction(params[0]) ?
    conjunction.create(params[0]) :
    params[0];

  if (conjunction.Conjunction.isConjunction(targetProperty) &&
      targetProperty.satisfied(inputObj)) {
    return required.validate(val);
  }

  if (!_.isUndefined(inputObj[targetProperty]) &&
      !_.isUndefined(params[1]) &&
      inputObj[targetProperty] === params[1]) {
    return required.validate(val);
  }

  return true;
};

const message = required.message;

export default {validate, message};

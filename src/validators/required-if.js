import noes from 'noes';
import _ from 'lodash/fp';
import required from './required';

const validate = (val, ruleObj, propertyName, inputObj) => {
  const params = ruleObj.params;
  const targetProperty = noes.Conjunction.shouldCreateConjunction(params[0]) ?
    noes.create(params[0]) :
    params[0];

  if (noes.Conjunction.isConjunction(targetProperty) &&
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

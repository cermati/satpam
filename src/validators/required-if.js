import noes from 'noes';
import isNil from 'ramda/src/isNil';
import required from './required';

const fullName = 'requiredIf:$1:$2';

const validate = (val, ruleObj, propertyName, inputObj) => {
  const params = ruleObj.params;
  const targetProperty = noes.Conjunction.shouldCreateConjunction(params[0]) ?
    noes.create(params[0]) :
    params[0];

  if (noes.Conjunction.isConjunction(targetProperty) &&
      targetProperty.satisfied(inputObj)) {
    return required.validate(val);
  }

  if (!isNil(inputObj) &&
      !isNil(inputObj[targetProperty]) &&
      !isNil(params[1]) &&
      inputObj[targetProperty] === params[1]) {
    return required.validate(val);
  }

  return true;
};

const message = required.message;

export default { fullName, validate, message };

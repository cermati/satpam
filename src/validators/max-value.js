import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  const valAsNumber = is(Number, val) ? val : Number(val);

  if (isNaN(valAsNumber)) {
    return false;
  }

  return valAsNumber <= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must be less than or equal to <%= ruleParams[0] %>.';

export default {validate, message};

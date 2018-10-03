import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  const valAsString = is(Function, val.toString) ? val.toString() : '';

  return valAsString.length <= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must contain at most <%= ruleParams[0] %> character(s).';

export default {validate, message};

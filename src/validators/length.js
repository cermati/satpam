import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const fullName = 'length:$1';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  const valAsString = is(Function, val.toString) ? val.toString() : '';

  return valAsString.length === Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must have length of <%= ruleParams[0] %> character(s).';

export default { fullName, validate, message };

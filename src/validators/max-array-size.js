import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const fullName = 'maxArraySize:$1';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }
  if (!is(Array, val)) {
    return false;
  }
  
  return val.length <= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must have at most <%= ruleParams[0] %> item(s).';

export default { fullName, validate, message };

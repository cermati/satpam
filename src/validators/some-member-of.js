import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import any from 'ramda/src/any';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  const valArray = is(Array, val) ? val : [val];
  const list = ruleObj.params[0];
  const inList = item => list.indexOf(item) >= 0;

  return any(inList, valArray);
};

const message = '<%= propertyName %> must be one of <%= ruleParams[0] %>.';

export default {validate, message};

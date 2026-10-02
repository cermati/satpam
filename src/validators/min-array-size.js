import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import trim from 'ramda/src/trim';

const fullName = 'minArraySize:$1';

const isEmptyString = item => is(String, item) && trim(item) === '';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }
  if (!is(Array, val) || val.some(isEmptyString)) {
    return false;
  }

  return val.length >= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must have at least <%= ruleParams[0] %> item(s) and must not contain empty strings.';

export default { fullName, validate, message };

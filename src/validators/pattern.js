import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const fullName = 'pattern:$1:$2';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  if (!is(String, val)) {
    return false;
  }

  const pattern = ruleObj.params[0];
  const flags = ruleObj.params[1];
  const regexp = new RegExp(pattern, flags);

  return regexp.test(val);
};

const message = '<%= propertyName %> does not conform pattern <%= ruleParams[0] %>.';

export default { fullName, validate, message };

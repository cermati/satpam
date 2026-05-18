import isEmpty from 'ramda/src/isEmpty';
import is from 'ramda/src/is';

const fullName = 'anyBeginWith:$1';

const validate = (val, ruleObj) => {
  if (!val || isEmpty(val)) {
    return false;
  }

  const valArray = is(Array, val) ? val : [val];
  const prefixList = ruleObj.params[0];

  for (const item of valArray) {
    const itemAsString = String(item);

    for (const prefix of prefixList) {
      if (itemAsString.startsWith(prefix)) {
        return true;
      }
    }
  }

  return false;
};

const message = 'At least one of <%= propertyName %> must begin with any of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

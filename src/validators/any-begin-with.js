import { isEmpty, isArray, startsWith, toLower } from 'lodash';

const fullName = 'any-beginWith:$1';

const validate = (val, ruleObj) => {
  if (isEmpty(val)) {
    return false;
  }

  const valArray = isArray(val) ? val : [val];
  const prefixList = ruleObj.params[0].map(rule => toLower(rule));

  for (const item of valArray) {
    const itemAsString = item.toString();

    for (const prefix of prefixList) {
      if (startsWith(toLower(itemAsString).trim(), prefix)) {
        return true;
      }
    }
  }

  return false;
};

const message = 'Any of <%= propertyName %> must begin with any of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

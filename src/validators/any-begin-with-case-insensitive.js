import isEmpty from 'ramda/src/isEmpty';

const fullName = 'anyBeginWithCaseInsensitive:$1';

const validate = (val, ruleObj) => {
  if (!val || isEmpty(val)) {
    return false;
  }

  const sanitizeValue = (input) => {
    return String(input).toLowerCase().trim();
  }

  const valArray = Array.isArray(val) ? val : [val];
  const prefixList = ruleObj.params[0].map(sanitizeValue);

  for (const item of valArray) {
    const itemAsString = sanitizeValue(item);

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

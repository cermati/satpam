import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
import some from 'lodash/some';

const fullName = 'some-memberOf:$1';

const validate = (val, ruleObj) => {
  if (isUndefined(val)) {
    return false;
  }

  const valArray = isArray(val) ? val : [val];
  const list = ruleObj.params[0];
  const inList = item => includes(list, item);

  return some(valArray, inList);
};

const message = '<%= propertyName %> must be one of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

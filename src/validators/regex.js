import _ from 'lodash/fp';

const validate = (val, ruleObj) => {
  if (!_.isString(val)) {
    return false;
  }

  const pattern = ruleObj.params[0];
  const flags = ruleObj.params[1];
  const regexp = new RegExp(pattern, flags);

  return regexp.test(val);
};

const message = '<%= propertyName %> does not conform pattern <%= ruleParams[0] %>.';

export default {validate, message};

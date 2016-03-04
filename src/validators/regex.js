import _ from 'lodash/fp';

module.exports = {
  validator: function (val, ruleObj) {
    if (!_.isString(val)) {
      return false;
    }

    const pattern = ruleObj.params[0];
    const flags = ruleObj.params[1];
    const regexp = new RegExp(pattern, flags);

    return regexp.test(val);
  },
  message: '<%= propertyName %> does not conform pattern <%= ruleParams[0] %>.'
};

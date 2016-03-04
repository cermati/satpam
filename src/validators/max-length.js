import _ from 'lodash/fp';

module.exports = {
  validator: (val, ruleObj) => {
    if (_.isUndefined(val) || _.isNull(val)) {
      return false;
    }

    const valAsString = _.isFunction(val.toString) ? val.toString() : '';

    return valAsString.length <= ruleObj.params[0];
  },
  message: '<%= propertyName %> must contain at most <%= ruleParams[0] %> character(s).'
};

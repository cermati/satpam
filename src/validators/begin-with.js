import _ from 'lodash/fp';

module.exports = {
  validator: (val, ruleObj) => {
    if (_.isUndefined(val) || _.isNull(val)) {
      return false;
    }

    const valArray = _.isArray(val) ? val : [val];
    const prefixList = ruleObj.params[0];

    return !_.some(item => {
      const itemAsString = item.toString();
      const itemBeginsWith = _.startsWith(_, itemAsString);

      return !_.some(itemBeginsWith, prefixList);
    }, valArray);
  },
  message: '<%= propertyName %> must begin with one of <%= ruleParams[0] %>.'
};

import _ from 'lodash/fp';

module.exports = {
  validator: (val, ruleObj) => {
    if (_.isUndefined(val) || _.isNull(val)) {
      return false;
    }

    const valAsNumber = _.isNumber(val) ? val : Number(val);

    if (_.isNaN(valAsNumber)) {
      return false;
    }

    return valAsNumber >= Number(ruleObj.params[0]);
  },
  message: '<%= propertyName %> must be greater than or equal to <%= ruleParams[0] %>.'
};

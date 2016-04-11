import _ from 'lodash/fp';

const validate = (val, ruleObj) => {
  if (_.isUndefined(val) || _.isNull(val)) {
    return true;
  }

  const valAsString = _.isFunction(val.toString) ? val.toString() : '';

  return valAsString.length >= ruleObj.params[0];
};

const message = '<%= propertyName %> must contain at least <%= ruleParams[0] %> character(s).';

export default {validate, message};

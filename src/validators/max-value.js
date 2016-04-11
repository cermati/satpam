import _ from 'lodash/fp';

const validate = (val, ruleObj) => {
  if (_.isUndefined(val) || _.isNull(val)) {
    return false;
  }

  const valAsNumber = _.isNumber(val) ? val : Number(val);

  if (_.isNaN(valAsNumber)) {
    return false;
  }

  return valAsNumber <= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must be less than or equal to <%= ruleParams[0] %>.';

export default {validate, message};

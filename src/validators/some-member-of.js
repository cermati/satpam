import _ from 'lodash';

const validate = (val, ruleObj) => {
  if (_.isUndefined(val)) {
    return false;
  }

  const valArray = _.isArray(val) ? val : [val];
  const list = ruleObj.params[0];
  const inList = item => _.includes(list, item);

  return _.some(valArray, inList);
};

const message = '<%= propertyName %> must be one of <%= ruleParams[0] %>.';

export default {validate, message};

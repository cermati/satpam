import _ from 'lodash/fp';

const validate = (val, ruleObj) => {
  const valArray = _.isArray(val) ? val : [val];
  const list = ruleObj.params[0];
  const notInList = item => list.indexOf(item) === -1;

  return !_.some(notInList, valArray);
};

const message = '<%= propertyName %> must be one of <%= ruleParams[0] %>.';

export default {validate, message};

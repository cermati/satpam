import _ from 'lodash/fp';

module.exports = {
  validator: (val, ruleObj) => {
    const valArray = _.isArray(val) ? val : [val];
    const list = ruleObj.params[0];
    const notInList = item => list.indexOf(item) === -1;

    return !_.some(notInList, valArray);
  },
  message: '<%= propertyName %> must be one of <%= ruleParams[0] %>.'
};

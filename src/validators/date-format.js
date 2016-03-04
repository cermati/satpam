import moment from 'moment';

module.exports = {
  validator: (val, ruleObj) => {
    if (!val) {
      return true;
    }

    return moment(val, ruleObj.params[0], true).isValid();
  },
  message: '<%= propertyName %> must be in format <%= ruleParams[0] %>.'
};

import moment from 'moment';

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  return moment(val, ruleObj.params[0], true).isValid();
};

const message = '<%= propertyName %> must be in format <%= ruleParams[0] %>.';

export default {validate, message};

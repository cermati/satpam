import moment from 'moment';

const validate = val => {
  if (val) {
    return moment(val).isValid();
  }

  return true;
};

const message = '<%= propertyName %> is not a valid date.';

export default {validate, message};

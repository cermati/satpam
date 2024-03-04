import moment from 'moment';

const fullName = 'date';

const validate = val => {
  if (val) {
    return moment(val).isValid();
  }

  return true;
};

const message = '<%= propertyName %> is not a valid date.';

export default { fullName, validate, message };

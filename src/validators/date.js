import validator from 'validator';

const validate = val => {
  if (val) {
    return validator.isDate(val);
  }

  return true;
};

const message = '<%= propertyName %> is not a valid date.';

export default {validate, message};

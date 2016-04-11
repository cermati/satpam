import validator from 'validator';

const validate = val => {
  if (val) {
    return validator.isNumeric(val);
  }

  return true;
};

const message = '<%= propertyName %> must be a number.';

export default {validate, message};

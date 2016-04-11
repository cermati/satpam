import validator from 'validator';

const validate = val => {
  if (val) {
    return validator.isAlphanumeric(val);
  }

  return true;
};

const message = '<%= propertyName %> may only contain letters and numbers.';

export default {validate, message};

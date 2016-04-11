import validator from 'validator';

const validate = val => {
  if (val) {
    return validator.isEmail(val);
  }

  return true;
};

const message = '<%= propertyName %> must be email.';

export default {validate, message};

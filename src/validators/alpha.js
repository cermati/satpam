import validator from 'validator';

const validate = val => {
  if (val) {
    return validator.isAlpha(val);
  }

  return true;
};

const message = '<%= propertyName %> may only contain letters.';

export default {validate, message};

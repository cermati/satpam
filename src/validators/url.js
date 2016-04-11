import validator from 'validator';

const validate = val => {
  if (!val) {
    return true;
  }

  return validator.isURL(val);
};

const message = '<%= propertyName %> is not a valid url.';

export default {validate, message};

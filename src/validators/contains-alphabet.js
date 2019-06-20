const regex = /[a-zA-Z]{1,}/;

const validate = val => {
  if (val) {
    return regex.test(val);
  }

  return true;
};

const message = '<%= propertyName %> must contain at least 1 alphabet.';

export default {validate, message};

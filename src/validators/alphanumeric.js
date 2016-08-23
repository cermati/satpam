const alphanumericRegex = /^[0-9A-Z]+$/i;

const validate = val => {
  if (val) {
    return alphanumericRegex.test(val);
  }

  return true;
};

const message = '<%= propertyName %> may only contain letters and numbers.';

export default {validate, message};

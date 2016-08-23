const numericRegex = /^[-+]?[0-9]+$/;

const validate = val => {
  if (val) {
    return numericRegex.test(val);
  }

  return true;
};

const message = '<%= propertyName %> must be a number.';

export default {validate, message};

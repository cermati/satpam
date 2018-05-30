const alphaRegex = /^[A-Z ]+$/i;

const validate = val => {
  if (val) {
    return alphaRegex.test(val);
  }

  return true;
};

const message = '<%= propertyName %> may only contain letters.';

export default {validate, message};

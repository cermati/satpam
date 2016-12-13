const validate = val => {
  if (val) {
    return !isNaN(Number(val));
  }

  return true;
};

const message = '<%= propertyName %> must be a number.';

export default {validate, message};

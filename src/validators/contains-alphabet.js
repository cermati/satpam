import R from 'ramda';

const validate = val => {
  if (R.isNil(val)) {
    return true;
  }

  if (!R.is(String, val)) {
    return false;
  }

  return /[a-zA-Z]{1,}/.test(val);
};

const message = '<%= propertyName %> must contain at least 1 alphabet.';

export default {validate, message};

import R from 'ramda';

const validate = val => {
  if (R.isNil(val)) {
    return true;
  }

  if (!R.is(String, val)) {
    return false;
  }

  return /[A-Z]{1,}/.test(val);
};

const message = '<%= propertyName %> must contain at least 1 upper case character.';

export default {validate, message};

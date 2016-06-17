import R from 'ramda';

const validate = val => {
  // Only run validation if it's not nil.
  if (R.isNil(val)) {
    return true;
  }

  return R.is(String, val);
};

const message = '<%= propertyName %> is not a string.';

export default {validate, message};

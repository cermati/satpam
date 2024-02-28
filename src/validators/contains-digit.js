import R from 'ramda';

const fullName = 'containsDigit';

const validate = val => {
  if (R.isNil(val)) {
    return true;
  }

  if (!R.is(String, val)) {
    return false;
  }

  return /\d/.test(val);
};

const message = '<%= propertyName %> must contain at least 1 digit.';

export default { fullName, validate, message };

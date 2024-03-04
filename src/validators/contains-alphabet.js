import R from 'ramda';

const fullName = 'containsAlphabet';

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

export default { fullName, validate, message};

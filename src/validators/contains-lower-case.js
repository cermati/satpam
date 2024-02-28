import R from 'ramda';

const fullName = 'containsLowerCase';

const validate = val => {
  if (R.isNil(val)) {
    return true;
  }

  if (!R.is(String, val)) {
    return false;
  }

  return /[a-z]{1,}/.test(val);
};

const message = '<%= propertyName %> must contain at least 1 lower case character.';

export default { fullName, validate, message };

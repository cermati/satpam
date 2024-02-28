import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const fullName = 'string';

const validate = val => {
  // Only run validation if it's not nil.
  if (isNil(val)) {
    return true;
  }

  return is(String, val);
};

const message = '<%= propertyName %> is not a string.';

export default { fullName, validate, message };

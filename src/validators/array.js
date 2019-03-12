import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const validate = val => {
  // Only run validation if it's not nil.
  if (isNil(val)) {
    return true;
  }

  return is(Array, val);
};

const message = '<%= propertyName %> is not an array.';

export default {validate, message};

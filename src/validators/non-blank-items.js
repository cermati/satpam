import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import trim from 'ramda/src/trim';

const fullName = 'nonBlankItems';

const isBlankString = item => is(String, item) && trim(item) === '';

const validate = val => {
  if (isNil(val)) {
    return true;
  }
  if (!is(Array, val)) {
    return false;
  }

  return !val.some(isBlankString);
};

const message = '<%= propertyName %> must not contain blank item(s).';

export default { fullName, validate, message };

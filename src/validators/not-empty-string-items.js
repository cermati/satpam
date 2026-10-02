import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import trim from 'ramda/src/trim';

const fullName = 'notEmptyStringItems';

const isEmptyString = item => is(String, item) && trim(item) === '';

const validate = val => {
  if (isNil(val)) {
    return true;
  }
  if (!is(Array, val)) {
    return false;
  }

  return !val.some(isEmptyString);
};

const message = '<%= propertyName %> must not contain empty string item(s).';

export default { fullName, validate, message };

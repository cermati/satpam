import is from 'ramda/src/is';
import trim from 'ramda/src/trim';
import required from './required';

const validate = val => {
  const trimmedValue = is(String, val) ? trim(val) : val;

  return required.validate(trimmedValue);
};

const message = '<%= propertyName %> field must not be completely consists of white spaces.';

export default {validate, message};

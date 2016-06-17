import R from 'ramda';
import required from './required';

const validate = val => {
  const trimmedValue = R.is(String, val) ? R.trim(val) : val;

  return required.validate(trimmedValue);
};

const message = '<%= propertyName %> field must not be completely consists of white spaces.';

export default {validate, message};

import isNil from 'ramda/src/isNil';
import isEmpty from 'ramda/src/isEmpty';

const validate = val  => {
  if (isNil(val)) {
    return true;
  }

  if (isEmpty(val)){
    return false;
  }

  const regexp = /^\d*$/g;

  return regexp.test(String(val));
};

const message = '<%= propertyName %> must be a digit.';

export default {validate, message};

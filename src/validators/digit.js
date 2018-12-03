import isNil from 'ramda/src/isNil';
import isEmpty from 'ramda/src/isEmpty';

const regexp = /^\d*$/;

const validate = val  => {
  if (isNil(val)) {
    return true;
  }

  const stringVal = String(val);

  if (isEmpty(stringVal)){
    return false;
  }

  return regexp.test(stringVal);
};

const message = '<%= propertyName %> must be a digit.';

export default {validate, message};

import isNil from 'ramda/src/isNil';
import isEmpty from 'ramda/src/isEmpty';
import toString from 'ramda/src/toString';

const validate = val  => {
  if (isNil(val)) {
    return true;
  }

  if (isEmpty(val)){
    return false;
  }

  const regexp = new RegExp(/^\d*$/g);
  const stringVal = typeof val === 'string' ? val : toString(val);

  return regexp.test(stringVal);
};

const message = '<%= propertyName %> must be a digit.';

export default {validate, message};

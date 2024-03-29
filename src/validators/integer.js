import isInteger from 'lodash/isInteger';
import isNil from 'ramda/src/isNil';
import isEmpty from 'ramda/src/isEmpty';

const fullName = 'integer';

const validate = val => {
  if (isNil(val)) {
    return true;
  }

  const stringVal = String(val);
  const numberVal = Number(val);

  if (isEmpty(stringVal) || isNaN(numberVal)) {
    return false;
  }

  return isInteger(numberVal);
};

const message = '<%= propertyName %> must be an integer.';

export default { fullName, validate, message };

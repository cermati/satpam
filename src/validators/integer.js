import _ from 'lodash';
import isNil from 'ramda/src/isNil';
import isEmpty from 'ramda/src/isEmpty';

const validate = val => {
  if (isNil(val)) {
    return true;
  }
  
  const stringVal = String(val);
  const numberVal = Number(val);

  if (isEmpty(stringVal) || isNaN(numberVal)) {
    return false;
  }

  return _.isInteger(numberVal);
};

const message = '<%= propertyName %> must be an integer.';

export default {validate, message};

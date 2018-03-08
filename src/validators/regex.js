import isNil from 'lodash/isNil';

const validate = val => {
  if (isNil(val)) {
    return true;
  }

  try {
    new RegExp(val);
    return true;
  } catch (e) {
    return false;
  }
};

const message = '<%= propertyName %> is not a valid regex string.';

export default {validate, message};

import isNil from 'ramda/src/isNil';

const validate = val => {
  if (isNil(val)) {
    return true;
  }

  return val.__proto__.constructor === Object;
};

const message = '<%= propertyName %> is not an object.';

export default {validate, message};

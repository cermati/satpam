import isNil from 'ramda/src/isNil';

const fullName = 'plainObject';

const validate = val => {
  if (isNil(val)) {
    return true;
  }

  return val.__proto__.constructor === Object;
};

const message = '<%= propertyName %> is not a plain object.';

export default { fullName, validate, message };

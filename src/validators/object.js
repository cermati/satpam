const _ = require('lodash');

const validate = val => {
  if (_.isNil(val)) {
    return true;
  }

  return val.__proto__.constructor === Object;
};

const message = '<%= propertyName %> is not an object.';

export default {validate, message};

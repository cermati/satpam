import _ from 'lodash/fp';

const validate = val => {
  // Only run validation if it's defined.
  if (_.isUndefined(val)) {
    return true;
  }

  return _.isString(val);
};

const message = '<%= propertyName %> is not a string.';

export default {validate, message};

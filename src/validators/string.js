import _ from 'lodash/fp';

exports = module.exports = {
  validator: val => {
    // Only run validation if it's defined.
    if (_.isUndefined(val)) {
      return true;
    }

    return _.isString(val);
  },
  message: '<%= propertyName %> is not a string.'
};

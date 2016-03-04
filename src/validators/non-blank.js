import _ from 'lodash/fp';
import required from './required';

module.exports = {
  validator: val => {
    const trimmedValue = _.isString(val) ? _.trim(val) : val;
    return required.validator(trimmedValue);
  },
  message: '<%= propertyName %> field must not be completely consists of white spaces.'
};

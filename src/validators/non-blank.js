import _ from 'lodash/fp';
import required from './required';

const validate = val => {
  const trimmedValue = _.isString(val) ? _.trim(val) : val;

  return required.validate(trimmedValue);
};

const message = '<%= propertyName %> field must not be completely consists of white spaces.';

export default {validate, message};

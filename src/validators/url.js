import validator from 'validator';

module.exports = {
  validator: val => {
    if (!val) {
      return true;
    }

    return validator.isURL(val);
  },
  message: '<%= propertyName %> is not a valid url.'
};

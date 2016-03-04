import validator from 'validator';

module.exports = {
  validator: val => {
    if (val) {
      return validator.isEmail(val);
    }

    return true;
  },
  message: '<%= propertyName %> must be email.'
};

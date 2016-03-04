import validator from 'validator';

module.exports = {
  validator: val => {
    if (val) {
      return validator.isDate(val);
    }

    return true;
  },
  message: '<%= propertyName %> is not a valid date.'
};

import validator from 'validator';

module.exports = {
  validator: function (val) {
    if (val) {
      return validator.isNumeric(val);
    }

    return true;
  },
  message: '<%= propertyName %> must be a number.'
};

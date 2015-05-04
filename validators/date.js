var stringValidator = require('validator');

exports = module.exports = {
  validator: function(val) {
    if (val) {
      return stringValidator.isDate(val);
    }

    return true;
  },
  message: '<%= propertyName %> is not a valid date.'
};

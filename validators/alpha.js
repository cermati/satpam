var stringValidator = require('validator');

exports = module.exports = {
  validator: function(val) {
    if (val) {
      return stringValidator.isAlpha(val);
    }

    return true;
  },
  message: '<%= propertyName %> may only contain letters.'
};

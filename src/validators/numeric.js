'use strict';

var stringValidator = require('validator');

exports = module.exports = {
  validator: function (val) {
    if (val) {
      return stringValidator.isNumeric(val);
    }

    return true;
  },
  message: '<%= propertyName %> must be a number.'
};

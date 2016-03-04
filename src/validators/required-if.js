'use strict';

var required = require('./required');

module.exports = {
  validator: function (val, ruleObj, propertyName, inputObj) {
    var targetProperty = ruleObj.params[0];

    if (inputObj[targetProperty] === ruleObj.params[1]) {
      return required.validator(val);
    }

    return true;
  },
  message: required.message
};

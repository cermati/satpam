'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val) {
    var trimmedValue = val;
    if (_.isString(val)) {
      trimmedValue = _.trim(val);
    }
    return required.validator(trimmedValue);
  },
  message: '<%= propertyName %> field must not be completely consists of white spaces.'
};

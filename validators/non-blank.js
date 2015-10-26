'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val) {
    if (_.isString(val)) {
      return required.validator(_.trim(val));
    }
    return true;
  },
  message: '<%= propertyName %> field must not be completely consists of white spaces.'
};

'use strict';

var _ = require('lodash');

exports = module.exports = {
  validator: function (val) {
    if (val) {
      return _.isString(val);
    }

    return true;
  },
  message: '<%= propertyName %> is not a string.'
};

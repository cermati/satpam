'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    if (_.isString(val)) {
      return val.length >= ruleObj.params[0]
    }
    return true;
  },
  message: '<%= propertyName %> must contain at least <%= ruleParams[0] %> character(s).'
};

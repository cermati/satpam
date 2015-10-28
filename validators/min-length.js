'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    if (_.isUndefined(val) || _.isNull(val)) {
      return false;
    }

    var valAsString = val;
    if (!_.isString(val)) {
      if (val.toString) {
        valAsString = val.toString();
      } else {
        valAsString = '';
      }
    }
    return valAsString.length >= ruleObj.params[0]
  },
  message: '<%= propertyName %> must contain at least <%= ruleParams[0] %> character(s).'
};

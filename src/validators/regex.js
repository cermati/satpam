'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    if (!_.isString(val)) {
      return false;
    }

    var pattern = ruleObj.params[0];
    var flags = ruleObj.params[1];
    var regexp = new RegExp(pattern, flags);

    return regexp.test(val);
  },
  message: '<%= propertyName %> does not conform pattern <%= ruleParams[0] %>.'
};


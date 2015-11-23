'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    return val !== ruleObj.params[0];
  },
  message: '<%= propertyName %> must not equal to <%= ruleParams[0] %>.'
};


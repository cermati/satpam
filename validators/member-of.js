'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    var valArray = val;
    if (!_.isArray(val)) {
      valArray = [val];
    }

    var list = ruleObj.params[0];
    return !_.some(valArray, function notInList(item) {
      return list.indexOf(item) === -1;
    });
  },
  message: '<%= propertyName %> must be one of <%= ruleParams[0] %>.'
};

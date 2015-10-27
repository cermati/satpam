'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    var valArray = val;
    if (!_.isArray(val)) {
      valArray = [val];
    }

    var prefixList = ruleObj.params[0];
    return !_.some(valArray, function notInList(item) {
      var itemAsString = item.toString();
      return !_.some(prefixList, function itemBeginWith(prefix) {
        return _.startsWith(itemAsString, prefix);
      });
    });
  },
  message: '<%= propertyName %> must begin with one of <%= ruleParams[0] %>.'
};

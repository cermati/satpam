'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    var valAsNumber = val;
    if (!_.isNumber(val)) {
      valAsNumber = Number(val);
    }

    if (_.isNaN(valAsNumber)) {
      return true;
    }

    return valAsNumber >= Number(ruleObj.params[0]);
  },
  message: '<%= propertyName %> must be greater than or equal to <%= ruleParams[0] %>.'
};

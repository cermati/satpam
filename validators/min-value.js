'use strict';

var required = require('./required');
var _ = require('lodash');

exports = module.exports = {
  validator: function (val, ruleObj) {
    if (_.isUndefined(val) || _.isNull(val)) {
      return false;
    }

    var valAsNumber = val;
    if (!_.isNumber(val)) {
      valAsNumber = Number(val);
    }

    if (_.isNaN(valAsNumber)) {
      return false;
    }

    return valAsNumber >= Number(ruleObj.params[0]);
  },
  message: '<%= propertyName %> must be greater than or equal to <%= ruleParams[0] %>.'
};

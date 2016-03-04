'use strict';

var moment = require('moment');

exports = module.exports = {
  validator: function (val, ruleObj) {
    if (!val) {
      return true;
    }

    return moment(val, ruleObj.params[0], true).isValid();
  },
  message: '<%= propertyName %> must be in format <%= ruleParams[0] %>.'
};


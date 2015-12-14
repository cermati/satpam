'use strict';

var moment = require('moment');
var NOW = 'now';

exports = module.exports = {
  validator: function (val, ruleObj) {
    if (!val) {
      return true;
    }

    var date;
    var dateInputFormat = ruleObj.params[0];
    var dateInput = moment(val, dateInputFormat);

    if (ruleObj.params[1].toLowerCase() === NOW) {
      date = moment();
    } else {
      date = moment(ruleObj.params[1], dateInputFormat);
    }

    return dateInput.isAfter(date, 'day');
  },
  message: '<%= propertyName %> must greater than <%= ruleParams[1] %>.'
};


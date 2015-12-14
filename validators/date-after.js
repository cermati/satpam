'use strict';

var _ = require('lodash');
var moment = require('moment');
var NOW = 'now';
var message = '<%= propertyName %> must greater than <%= ruleParams[1] %>.';
var self = exports;

// Use object (it will be passed as reference at index.js) to represent the message,
// because we want to change it dynamically based on the offset parameter
// based on the offset parameters.
var messageObj = {
  toString: _.constant(message)
};

exports = module.exports = {
  validator: function (val, ruleObj) {
    if (!val) {
      return true;
    }

    var date;
    var dateInputFormat = ruleObj.params[0];
    var dateInput = moment(val, dateInputFormat);
    var offset = Number(ruleObj.params[2]);

    if (ruleObj.params[1].toLowerCase() === NOW) {
      date = moment();
    } else {
      date = moment(ruleObj.params[1], dateInputFormat);
    }

    messageObj.toString = _.constant(message);

    if (offset) {
      if (offset < 0) {
        offset = Math.abs(offset);
        messageObj.toString = _.constant(
          '<%= propertyName %> must greater than <%= ruleParams[1] %> minus <%= Math.abs(ruleParams[2]) %> days.'
        );
        date = date.subtract(offset, 'days');
      } else {
        messageObj.toString = _.constant('<%= propertyName %> must greater than <%= ruleParams[1] %> plus <%= ruleParams[2] %> days.');
        date = date.add(offset, 'days');
      }
    }

    return dateInput.isAfter(date, 'day');
  },
  message: messageObj
};


'use strict';

var _ = require('lodash/fp');
var equal = require('./equal');

exports = module.exports = {
  validator: _.negate(equal.validator),
  message: '<%= propertyName %> must not equal to <%= ruleParams[0] %>.'
};

'use strict';

var phoneNumberRegex = /^(0|62|\+62)[0-9]{6,15}$/;

module.exports = {
  validator: phoneNumberRegex.test.bind(phoneNumberRegex),
  message: '<%= propertyName %> field is not a valid phone number.'
};

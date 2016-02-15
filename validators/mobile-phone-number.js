'use strict';

var mobilePhoneNumberRegex = /^(08|628|\+628)[0-9]{6,11}$/;

module.exports = {
  validator: mobilePhoneNumberRegex.test.bind(mobilePhoneNumberRegex),
  message: '<%= propertyName %> field is not a valid mobile phone number.'
};

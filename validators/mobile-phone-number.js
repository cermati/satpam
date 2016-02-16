'use strict';

var mobilePhoneNumberRegex = /^(08|628|\+628)[0-9]{6,11}$/;

module.exports = {
  validator: function (value) {
    if (!value) {
      return true;
    }

    return mobilePhoneNumberRegex.test(value);
  },
  message: '<%= propertyName %> field is not a valid mobile phone number.'
};

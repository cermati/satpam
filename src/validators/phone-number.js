const phoneNumberRegex = /^(0|62|\+62)[0-9]{6,15}$/;

module.exports = {
  validator: function (value) {
    if (!value) {
      return true;
    }

    return phoneNumberRegex.test(value);
  },
  message: '<%= propertyName %> field is not a valid phone number.'
};

const mobilePhoneNumberRegex = /^(08|628|\+628)[0-9]{6,11}$/;

const validate = value => {
  if (!value) {
    return true;
  }

  return mobilePhoneNumberRegex.test(value);
};

const message = '<%= propertyName %> field is not a valid mobile phone number.';

export default {validate, message};

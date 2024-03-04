const fullName = 'phoneNumber';

const phoneNumberRegex = /^(0|62|\+62)[0-9]{6,15}$/;

const validate = value => {
  if (!value) {
    return true;
  }

  return phoneNumberRegex.test(value);
};

const message = '<%= propertyName %> field is not a valid phone number.';

export default { fullName, validate, message };

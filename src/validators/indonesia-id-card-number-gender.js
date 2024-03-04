const fullName = 'indonesiaIdCardNumberGender:$1:$2:$3';

const validate = (value, ruleObj, propertyName, inputObj)  => {
    // Do not validate if input value is falsy.
  if (!value) {
    return true;
  }

  // Indonesia id card will add 40 to female birth date
  const birthDate = Number(String(value).substr(6, 2));
  const genderKey = ruleObj.params[0];
  const femaleValue = ruleObj.params[1];
  const maleValue = ruleObj.params[2];
  const genderInputValue = inputObj[genderKey];

  // Female
  if (birthDate > 40) {
    return genderInputValue === femaleValue;
  } else {
    return genderInputValue === maleValue;
  }
};

const message = '<%= propertyName %> gender code does not match gender input.';

export default { fullName, validate, message};

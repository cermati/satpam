import moment from 'moment';

const validate = (value, ruleObj, propertyName, inputObj)  => {
    // Do not validate if input value is falsy.
  if (!value) {
    return true;
  }

  // Birth date on indonesian id card starts at the 7th digit
  // For example 012345[020993]3456 = 02-09-93 with format DD-MM-YYYY
  // so basically we'll get the first 6 digits starting from the 7th digit (zero based index)
  const birthDateFromIdCard = String(value).substr(6, 6);
  const birthDateInputKey = ruleObj.params[0];
  const birthDateInputFormat = ruleObj.params[1];
  const birthDateValue = moment(inputObj[birthDateInputKey], birthDateInputFormat).format('DDMMYY');

  return birthDateValue === birthDateFromIdCard;
};

const message = '<%= propertyName %> birth date number sequence does not match the given birth date.';

export default {validate, message};

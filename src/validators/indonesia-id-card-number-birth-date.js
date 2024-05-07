import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const fullName = 'indonesiaIdCardNumberBirthDate:$1:$2';

const validate = (value, ruleObj, propertyName, inputObj)  => {
    // Do not validate if input value is falsy.
  if (!value) {
    return true;
  }

  // Birth date on indonesian id card starts at the 7th digit
  // For example 012345[020993]3456 = 02-09-93 with format DD-MM-YYYY
  // so basically we'll get the first 6 digits starting from the 7th digit (zero based index)
  let birthDateFromIdCard = Number(String(value).substr(6, 2));

  // Indonesia id card adds 40 to female birth date
  if (birthDateFromIdCard > 40) {
    birthDateFromIdCard = birthDateFromIdCard - 40;
  }

  // We converted this into Number, it will strip trailing zero, we'll prepend
  // the stripped leading zero if birthDateFromIdCard is less than 10
  if (birthDateFromIdCard < 10) {
    birthDateFromIdCard = `0${birthDateFromIdCard}`;
  }

  const monthAndYearFromIdCard = String(value).substr(8, 4);
  const birthDateInputKey = ruleObj.params[0];
  const birthDateInputFormat = ruleObj.params[1];
  const birthDateValue = dayjs(inputObj[birthDateInputKey], birthDateInputFormat).format('DDMMYY');

  return birthDateValue === `${birthDateFromIdCard}${monthAndYearFromIdCard}`;
};

const message = '<%= propertyName %> birth date number sequence does not match the given birth date.';

export default { fullName, validate, message };

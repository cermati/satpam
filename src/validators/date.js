import dayjs from 'dayjs';

const fullName = 'date';

const validate = val => {
  if (val) {
    return dayjs(val).isValid();
  }

  return true;
};

const message = '<%= propertyName %> is not a valid date.';

export default { fullName, validate, message };

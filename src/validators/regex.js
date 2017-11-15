const validate = val => {
  try {
    new RegExp(val);
    return true;
  } catch (e) {
    return false;
  }
};

const message = '<%= propertyName %> must be a regex.';

export default {validate, message};

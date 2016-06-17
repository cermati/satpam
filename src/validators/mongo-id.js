// A regex to check whether the given string is a valid object id
// https://github.com/Automattic/mongoose/issues/1959
const regex = /^[a-fA-F0-9]{24}$/;

const validate = val => {
  if (!val) {
    return true;
  }

  return regex.test(val.toString());
};

const message = '<%= propertyName %> field is not a valid Mongo ID.';

export default {validate, message};

import _ from 'lodash/fp';

// A regex to check whether the given string is a valid object id
// https://github.com/Automattic/mongoose/issues/1959
const regex = /^[a-fA-F0-9]{24}$/;

module.exports = {
  validator: val => {
    if (!val) {
      return true;
    }

    return regex.test(val.toString());
  },
  message: '<%= propertyName %> field is not a valid Object ID.'
};

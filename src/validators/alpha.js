import validator from 'validator';

module.exports = {
  validator: val => {
    if (val) {
      return validator.isAlpha(val);
    }

    return true;
  },
  message: '<%= propertyName %> may only contain letters.'
};

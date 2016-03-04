import required from './required';

module.exports = {
  validator: (val, ruleObj, propertyName, inputObj) => {
    const targetProperty = ruleObj.params[0];

    if (inputObj[targetProperty] === ruleObj.params[1]) {
      return required.validator(val);
    }

    return true;
  },
  message: required.message
};

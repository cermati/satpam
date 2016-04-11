import required from './required';

const validate = (val, ruleObj, propertyName, inputObj) => {
  const targetProperty = ruleObj.params[0];

  if (inputObj[targetProperty] === ruleObj.params[1]) {
    return required.validate(val);
  }

  return true;
};

const message = required.message;

export default {validate, message};

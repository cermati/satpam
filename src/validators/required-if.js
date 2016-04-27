import _ from 'lodahs/fp';
import required from './required';

class And {
  constructor(mappings) {
    this.mappings = mappings;
  }

  satisfied(inputObj) {
    const equalInput = function (mapping) {
      return _.get(mapping.key, inputObj) === mapping.value;
    };

    return _.every(equalInput, this.mappings);
  }
}

class Or {
  constructor(mappings) {
    this.mappings = mappings;
  }

  satisfied(inputObj) {
    const equalInput = function (mapping) {
      return _.get(mapping.key, inputObj) === mapping.value;
    };

    return _.some(equalInput, this.mappings);
  }
}

const validate = (val, ruleObj, propertyName, inputObj) => {
  const targetProperty = ruleObj.params[0];

  if ((targetProperty instanceof And && targetProperty.satisifed(inputObj)) ||
      (targetProperty instanceof Or && targetProperty.satisfied(inputObj)) ||
      (inputObj[targetProperty] === ruleObj.params[1])) {
    return required.validate(val);
  }

  return true;
};

const message = required.message;

export default {validate, message, And, Or};

import _ from 'lodash/fp';
import required from './required';

class And {
  constructor(mappings) {
    this.type = 'and';
    this.mappings = mappings;
  }

  satisfied(inputObj) {
    const equalInput = mapping => {
      return _.get(mapping.key, inputObj) === mapping.value;
    };

    return _.every(equalInput, this.mappings);
  }
}

class Or {
  constructor(mappings) {
    this.type = 'or';
    this.mappings = mappings;
  }

  satisfied(inputObj) {
    const equalInput = mappingKey => {
      return _.get(mappingKey, inputObj) === _.get(mappingKey, this.mappings);
    };

    return _.some(equalInput, _.keys(this.mappings));
  }
}

const isAnd = structure => {
  return structure instanceof And || structure.type === 'and';
};

const isOr = structure => {
  return structure instanceof Or || structure.type === 'or';
};

const shouldUseSatisfied = structure => {
  return isAnd(structure) || isOr(structure);
};

const validate = (val, ruleObj, propertyName, inputObj) => {
  const targetProperty = ruleObj.params[0];

  if ((shouldUseSatisfied(targetProperty) && targetProperty.satisfied(inputObj))) {
    return required.validate(val);
  }

  if (!_.isUndefined(inputObj[targetProperty]) &&
      inputObj[targetProperty] === ruleObj.params[1]) {
    return required.validate(val);
  }

  return true;
};

const message = required.message;

export default {validate, message, And, Or};

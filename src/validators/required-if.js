import _ from 'lodash/fp';
import required from './required';

class Conjunction {
  constructor(mappings) {
    this.type = 'or';
    this.mappings = mappings;
  }

  createEqualInputChecker(inputObj) {
    return mappingKey => {
      const mappingValue = _.get(mappingKey, this.mappings);
      const inputValue = _.get(mappingKey, inputObj);

      if (_.isArray(mappingValue)) {
        return mappingValue.indexOf(inputValue) > -1;
      }

      return inputValue === mappingValue;
    };
  }

  static shouldConvertToConjunction(obj) {
    return !Conjunction.isConjunction(obj) &&
      _.isObject(obj) &&
      _.has('type', obj) &&
      _.has('mappings', obj);
  }

  static isConjunction(obj) {
    return obj instanceof Conjunction;
  }
}

class And extends Conjunction {
  satisfied(inputObj) {
    const equalInput = this.createEqualInputChecker(inputObj);

    return _.every(equalInput, _.keys(this.mappings));
  }
}

class Or extends Conjunction {
  satisfied(inputObj) {
    const equalInput = this.createEqualInputChecker(inputObj);

    return _.some(equalInput, _.keys(this.mappings));
  }
}

const objectIsAndConjunction = _.flowRight(
  _.eq('and'),
  _.property('type')
);

const objectIsOrConjunction = _.flowRight(
  _.eq('or'),
  _.property('type')
);

const conjunction = obj => {
  if (objectIsOrConjunction(obj)) {
    return new Or(obj.mappings);
  } else {
    return new And(obj.mappings);
  }
};

const validate = (val, ruleObj, propertyName, inputObj) => {
  const params = ruleObj.params;
  const targetProperty = Conjunction.shouldConvertToConjunction(params[0]) ? conjunction(params[0]) : params[0];

  if ((Conjunction.isConjunction(targetProperty) && targetProperty.satisfied(inputObj))) {
    return required.validate(val);
  }

  if (!_.isUndefined(inputObj[targetProperty]) &&
      !_.isUndefined(params[1]) &&
      inputObj[targetProperty] === params[1]) {
    return required.validate(val);
  }

  return true;
};

const message = required.message;

export default {validate, message, And, Or};

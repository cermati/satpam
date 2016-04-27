import _ from 'lodash/fp';

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

const create = obj => {
  if (objectIsOrConjunction(obj)) {
    return new Or(obj.mappings);
  } else {
    return new And(obj.mappings);
  }
};

export default {
  Conjunction,
  And,
  Or,
  create
};

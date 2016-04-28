import _ from 'lodash/fp';

const AND = 'and';
const OR = 'or';

class Conjunction {
  constructor(mappings) {
    this.mappings = mappings;
  }

  createEqualInputChecker(inputObj) {
    return mappingKey => {
      const mappingValue = _.get(mappingKey, this.mappings);
      const inputValue = _.get(mappingKey, inputObj);

      // Nested conjunction
      if (Conjunction.isConjunction(mappingValue)) {
        return mappingValue.satisfied(inputValue);
      } else if (Conjunction.shouldConvertToConjunction(mappingValue)) {
        return create(mappingValue).satisfied(inputValue);
      } else {
        return inputValue === mappingValue;
      }
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
  constructor(mappings) {
    super(mappings);
    this.type = AND;
  }

  satisfied(inputObj) {
    const equalInput = this.createEqualInputChecker(inputObj);

    return _.every(equalInput, _.keys(this.mappings));
  }
}

class Or extends Conjunction {
  constructor(mappings) {
    super(mappings);
    this.type = OR;
  }

  satisfied(inputObj) {
    const equalInput = this.createEqualInputChecker(inputObj);

    return _.some(equalInput, _.keys(this.mappings));
  }
}

const objectIsAndConjunction = _.flowRight(
  _.eq(AND),
  _.property('type')
);

const objectIsOrConjunction = _.flowRight(
  _.eq(OR),
  _.property('type')
);

const create = obj => {
  if (objectIsOrConjunction(obj)) {
    return new Or(obj.mappings);
  } else if (objectIsAndConjunction(obj)) {
    return new And(obj.mappings);
  } else {
    var message = 'Cannot create conjunction based on ' + obj;
    throw new Error(message);
  }
};

export default {
  Conjunction,
  And,
  Or,
  create
};

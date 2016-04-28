import _ from 'lodash/fp';

const AND = 'and';
const OR = 'or';

/**
 * @constructor
 * @author Sendy Halim <sendyhalim93@gmail.com>
 */
class Conjunction {
  constructor(mappings) {
    this.mappings = mappings;
  }

  /**
   * Create a function that will check whether the given input object
   * match the mappings
   * @param {Object<String, Any>} inputObj
   * @returns {Boolean}
   */
  createEqualInputChecker(inputObj) {
    return mappingKey => {
      const mappingValue = _.get(mappingKey, this.mappings);
      const inputValue = _.get(mappingKey, inputObj);

      // Nested conjunction
      if (Conjunction.isConjunction(mappingValue)) {
        return mappingValue.satisfied(inputValue);
      } else if (Conjunction.shouldCreateConjunction(mappingValue)) {
        return create(mappingValue).satisfied(inputObj);
      } else if (_.isArray(mappingValue)) {
        return mappingValue.indexOf(inputValue) > -1;
      } else {
        return inputValue === mappingValue;
      }
    };
  }


  /**
   * Check if the given object should be made into an instance of `Conjunction`
   * @param {Object} obj
   * @param {String} obj.type
   * @param {Object} obj.mappings
   * @returns {Boolean}
   */
  static shouldCreateConjunction(obj) {
    return !Conjunction.isConjunction(obj) &&
      _.isObject(obj) &&
      _.has('type', obj) &&
      _.has('mappings', obj);
  }

  /**
   * Check if the given object is an instance of `Conjunction`
   * @param {Object} obj
   * @returns {Boolean}
   */
  static isConjunction(obj) {
    return obj instanceof Conjunction;
  }
}

/**
 * @constructor
 * @author Sendy Halim <sendyhalim93@gmail.com>
 */
class And extends Conjunction {
  constructor(mappings) {
    super(mappings);
    this.type = AND;
  }

  /**
   * Check if the given object satisfied the mappings
   * @param {Object} inputObj
   * @returns {Boolean}
   */
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

  /**
   * Check if the given object satisfied the mappings
   * @param {Object} inputObj
   * @returns {Boolean}
   */
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

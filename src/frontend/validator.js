import always from 'ramda/src/always';
import any from 'ramda/src/any';
import clone from 'ramda/src/clone';
import head from 'ramda/src/head';
import is from 'ramda/src/is';
import keys from 'ramda/src/keys';
import prop from 'ramda/src/prop';

import get from 'lodash/get';
import isArray from 'lodash/isArray';
import template from 'lodash/template';
import startCase from 'lodash/startCase';

class ValidationMessage {
  constructor() { }
}

/**
 * Create a new validator. When it's created, it will have a deep cloned global
 * validation rules and global validation messages. Any changes made to the
 * instance's rules or messages will not affect the global validation rules
 * and messages.
 */
class Validator {
  /**
   * Create a validator.
   *
   * @param {Object} options.rules
   * @param {Object} options.messages
   *
   * @example
   * import alphanumeric from 'satpam/lib/validators/alphanumeric';
   * import required from 'satpam/lib/validators/required';
   *
   * const customValidator = Validator({
   *   rules: {
   *     'minLength:$1': minLength.validate,
   *     required: required.validate
   *   },
   *   messages: {
   *     'minLength:$1': 'Must be at least <%= ruleParams[0] %> character(s).',
   *     required: required.message
   *   }
   * });
   */
  constructor(options = {}) {
    const { rules, messages } = options;

    console.log('=== RULES', rules)
    console.log('=== RULES', messages)

    this.validation = {
      rules: clone(rules),
      messages: clone(messages)
    };
  }

  /**
   * Create a rule object based on the given rule.
   * @param rule {Object|String}
   * @returns {{name: String, fullName: String, params: Array<String>, shouldValidate: Function}}
   */
  _createRuleObject(rule) {
    let ruleObj = {};

    if (is(String, rule)) {
      // First variant, everything is embedded as string
      const splitted = rule.split(':');

      // Get only the first part of full rule e.g if range:1:3 then
      // we will get 'range'
      ruleObj.name = head(splitted);
      // Get the rule params if e.g range:1:3 -> [1, 3]
      ruleObj.params = splitted.slice(1);
    } else {
      // Second variant, it is already parsed (Object)
      ruleObj.name = rule.name;
      ruleObj.fullName = rule.fullName;
      ruleObj.params = rule.params || [];
      ruleObj.shouldValidate = rule.shouldValidate;
    }

    ruleObj.shouldValidate = ruleObj.shouldValidate || always(true);

    if (!ruleObj.fullName) {
      // Property fullName is the generic full name of validation rule
      // e.g range:1:3 -> range:$1:$2, required -> required
      ruleObj.fullName = ruleObj.params.reduce((ruleName, val, index) => {
        return ruleName + ':$' + (index + 1).toString();
      }, ruleObj.name);
    }

    return ruleObj;
  }

  /**
   * This function is for validating the `inputObj` based on the given `ruleMapping`.
   * We need this function because `_validate` function will be called recursively
   * if there's a nested rule mappings, there's a case when we need the `rootInputObj`.
   * That's why we're separating the public API `validate` with this function which contains
   * all the heavy logic of coordinating validation rules.
   *
   * @param ruleMapping - An mapping of input property to the available rules
   *   e.g. {name: ['required', 'alpha']}
   * @param inputObj - Input object to be validated
   * @param rootInputObj - The root input object to be validated started from the top "tree" of input object.
   * @returns {{result: Boolean, messages: Object}}
   */
  _validate(ruleMapping, inputObj, rootInputObj) {
    const validator = this;
    let result = true;
    let messageObj = new ValidationMessage();

    // Loop through the given rule mapping
    keys(ruleMapping).forEach(propertyName => {
      const ruleArray = ruleMapping[propertyName];
      const val = get(inputObj, propertyName);
      const setValidationMessage = (ruleName, message) => {
        // Set messageObj initial value
        messageObj[propertyName] = messageObj[propertyName] || {};
        messageObj[propertyName][ruleName] = message;
      };

      const _validate = rule => {
        const ruleObj = this._createRuleObject(rule);
        const validate = validator.validation.rules[ruleObj.fullName];

        if (!ruleObj.shouldValidate(ruleObj, rootInputObj)) {
          return {
            success: true,
            ruleName: ruleObj.fullName,
            message: ''
          };
        }

        if (!is(Function, validate)) {
          const ruleObjString = JSON.stringify(ruleObj);
          throw new Error(`${ruleObj.fullName} is not a valid satpam validation rule. Rule object: ${ruleObjString}`);
        }

        const validationResult = validate(val, ruleObj, propertyName, inputObj);

        if (!validationResult) {
          return {
            success: false,
            ruleName: ruleObj.fullName,
            message: validator.getValidationMessage(ruleObj, inputObj, propertyName, val)
          }
        }

        return {
          success: true,
          ruleName: ruleObj.fullName,
          message: ''
        };
      };

      // Nested rule
      if (!isArray(ruleArray)) {
        const nestedResult = this._validate(
          ruleArray,
          get(inputObj, propertyName),
          rootInputObj
        );
        result = nestedResult.success && result;

        if (!nestedResult.success) {
          // Merge the result
          messageObj[propertyName] = nestedResult.messages;
        }
      } else {
        // Rule array should be something like ['required', 'email']
        ruleArray.forEach(rule => {
          // We will validate and return true if any of the rule passes
          if (is(Array, rule)) {
            const resultObjects = rule.map(_validate);
            const overallResult = any(prop('success'), resultObjects);

            // If none of the results is true then it
            if (!overallResult) {
              result = false;
              resultObjects.forEach(resultObj => {
                setValidationMessage(resultObj.ruleName, resultObj.message);
              });
            }
          } else {
            const resultObj = _validate(rule);

            if (!resultObj.success) {
              result = false;
              setValidationMessage(resultObj.ruleName, resultObj.message);
            }
          }
        });

      }
    });

    return {
      success: result,
      messages: messageObj
    };
  }

  /**
   * @example
   *   const ruleMapping = {name: ['required']};
   *   const inputObj = {name: ''};
   *   const validator = satpam.create();
   *   const result = validator.validate(ruleMapping, inputObj);
   *
   * @param ruleMapping - An mapping of input property to the available rules
   *   e.g. {name: ['required', 'alpha']}
   * @param inputObj - Input object to be validated
   * @returns {{result: Boolean, messages: Object}}
   */
  validate(ruleMapping, inputObj) {
    return this._validate(ruleMapping, inputObj, inputObj);
  }

  /**
   * @param ruleObj
   * @param inputObj
   * @param propertyName
   * @param val
   * @returns {String}
   */
  getValidationMessage(ruleObj, inputObj, propertyName, val) {
    const message = this.validation.messages[ruleObj.fullName];
    const messageTemplate = is(Function, message) ? message(ruleObj, propertyName, val) : message;
    const compiled = template(messageTemplate);
    propertyName = startCase(propertyName);

    return compiled({
      inputObj: inputObj,
      propertyName: propertyName,
      ruleName: ruleObj.fullName,
      ruleParams: ruleObj.params,
      value: val
    });
  }

  /**
   * Add custom validation the validator instance, it will only affect the
   * validator instance, if you want to add global validation rule then use
   * addCustomValidation method on satpam module.
   *
   * @example
   *   import satpam from 'satpam';
   *   satpam.addCustomValidation(.., ..);
   *
   * @param {String} ruleName
   * @param {Function} validateFunction
   */
  addCustomValidation(ruleName, validateFunction) {
    this.validation.rules[ruleName] = validateFunction;
  }

  /**
   * Set validation message for the given ruleName, it will only affect the
   * validator instance(the receiver), if you want to set global validation
   * message then use addCustomValidation method on satpam module.
   *
   * @example
   *   import satpam from 'satpam';
   *   satpam.setValidationMessage(.., ..);
   *
   * @param ruleName
   * @param message
   */
  setValidationMessage(ruleName, message) {
    this.validation.messages[ruleName] = message;
  }
}

export default Validator;

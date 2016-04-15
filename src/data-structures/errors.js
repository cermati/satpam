import {sprintf} from 'sprintf-js';

/**
 * A class that represents an invalid validation rule pareameter
 *
 * @constructor
 * @author Sendy Halim <sendyhalim93@gmail.com>
 * @param message - The error message.
 */
function InvalidValidationRuleParameter(ruleParameter) {
  this.message = sprintf('%s is not a valid rule parameter', ruleParameter);
  this.name = 'InvalidValidationRuleParameter';

  Error.captureStackTrace(this, InvalidValidationRuleParameter);
}

InvalidValidationRuleParameter.prototype = Object.create(Error.prototype);
InvalidValidationRuleParameter.prototype.constructor = InvalidValidationRuleParameter;

export {InvalidValidationRuleParameter};

/**
 * A class that represents an invalid validation rule pareameter
 *
 * @constructor
 * @author Sendy Halim <sendyhalim93@gmail.com>
 * @param message - The error message.
 */
function InvalidValidationRuleParameter(message) {
  this.message = message;
  this.name = 'InvalidValidationRuleParameter';

  Error.captureStackTrace(this, InvalidValidationRuleParameter);
}

InvalidValidationRuleParameter.prototype = Object.create(Error.prototype);
InvalidValidationRuleParameter.prototype.constructor = InvalidValidationRuleParameter;

exports.InvalidValidationRuleParameter = InvalidValidationRuleParameter;

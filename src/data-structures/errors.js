/**
 * A class that represents an invalid validation rule pareameter
 *
 * @constructor
 * @author Sendy Halim <sendyhalim93@gmail.com>
 * @param message - The error message.
 */
function InvalidValidationRuleParameter(ruleParameter, reason) {
  var defaultMessage = `${ruleParameter} %s is not a valid rule parameter.`;
  this.message = reason ? `${defaultMessage}. ${reason}` : defaultMessage;
  this.name = 'InvalidValidationRuleParameter';

  Error.captureStackTrace(this, InvalidValidationRuleParameter);
}

InvalidValidationRuleParameter.prototype = Object.create(Error.prototype);
InvalidValidationRuleParameter.prototype.constructor = InvalidValidationRuleParameter;

export {InvalidValidationRuleParameter};

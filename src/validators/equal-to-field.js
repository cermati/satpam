const fullName = 'equal-to-field:$1';

const validate = (val, ruleObj, propertyName, inputObj) => val === inputObj[ruleObj.params[0]];

const message = '<%= propertyName %> must equal to <%= inputObj[ruleParams[0]] %>.';

export default { fullName, validate, message };

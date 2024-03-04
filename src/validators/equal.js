const fullName = 'equal:$1';

const validate = (val, ruleObj) => val === ruleObj.params[0];

const message = '<%= propertyName %> must equal to <%= ruleParams[0] %>.';

export default { fullName, validate, message };

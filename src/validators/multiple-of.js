const fullName = 'multipleOf:$1';

const validate = (val, ruleObj) => {
  return (Number(val) % ruleObj.params[0]) === 0
};

const message = '<%= propertyName %> must be a multiple of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

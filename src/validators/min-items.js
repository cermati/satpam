import isNil from 'ramda/src/isNil';

const fullName = 'minItems:$1';

const validate = (val, ruleObj) => {
  if (isNil(val)) return true;
  if (!Array.isArray(val)) return false;
  return val.length >= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must have at least <%= ruleParams[0] %> item(s).';

export default { fullName, validate, message };

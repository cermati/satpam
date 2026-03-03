import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import all from 'ramda/src/all';

const fullName = 'mustInclude:$1';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  const valArray = is(Array, val) ? val : [val];
  const list = ruleObj.params[0];

  return all(item => valArray.includes(item), list);
};

const message = '<%= propertyName %> must include all of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

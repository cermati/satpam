import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import none from 'ramda/src/none';

const fullName = 'memberOf:$1';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  const valArray = is(Array, val) ? val : [val];
  const list = ruleObj.params[0];
  const notInList = item => list.indexOf(item) === -1;

  return none(notInList, valArray);
};

const message = '<%= propertyName %> must be one of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

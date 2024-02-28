import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import none from 'ramda/src/none';

const fullName = 'not-memberOf:$1'

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return true;
  }

  const valArray = is(Array, val) ? val : [val];
  const list = ruleObj.params[0];
  const inList = item => !(is(String, item)) | list.indexOf(item) !== -1;

  return none(inList, valArray);
};

const message = '<%= propertyName %> must not be one of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

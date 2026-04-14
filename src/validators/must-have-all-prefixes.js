import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';
import isEmpty from 'ramda/src/isEmpty';
import all from 'ramda/src/all';
import any from 'ramda/src/any';
import startsWith from 'ramda/src/startsWith';

const fullName = 'mustHaveAllPrefixes:$1';

const validate = (val, ruleObj) => {
  if (isEmpty(val) || isNil(val) || val.length < ruleObj.length) {
    return false;
  }

  const valArray = is(Array, val) ? val : [val];
  const list = ruleObj.params[0];

return all(
    prefix => any(startsWith(prefix), valArray), 
    list
  );
};

const message = '<%= propertyName %> must have all prefixes of <%= ruleParams[0] %>.';

export default { fullName, validate, message };

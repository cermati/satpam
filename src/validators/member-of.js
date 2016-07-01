import R from 'ramda';

const validate = (val, ruleObj) => {
  if (R.isNil(val)) {
    return true;
  }

  const valArray = R.is(Array, val) ? val : [val];
  const list = ruleObj.params[0];
  const notInList = item => list.indexOf(item) === -1;

  return R.none(notInList, valArray);
};

const message = '<%= propertyName %> must be one of <%= ruleParams[0] %>.';

export default {validate, message};

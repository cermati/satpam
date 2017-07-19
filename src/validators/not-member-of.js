import R from 'ramda';

const validate = (val, ruleObj) => {
  if (R.isNil(val)) {
    return true;
  }

  const valArray = R.is(Array, val) ? val : [val];
  const list = ruleObj.params[0];
  const inList = item => !(R.is(String, item)) | list.indexOf(item) != -1;

  return R.none(inList, valArray);
};

const message = '<%= propertyName %> must not be one of <%= ruleParams[0] %>.';

export default {validate, message};

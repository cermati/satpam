import R from 'ramda';

const validate = (val, ruleObj) => {
  if (R.isNil(val)) {
    return true;
  }

  const valAsString = R.is(Function, val.toString) ? val.toString() : '';

  return valAsString.length <= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must contain at most <%= ruleParams[0] %> character(s).';

export default {validate, message};

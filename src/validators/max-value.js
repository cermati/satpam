import R from 'ramda';

const validate = (val, ruleObj) => {
  if (R.isNil(val)) {
    return true;
  }

  const valAsNumber = R.is(Number, val) ? val : Number(val);

  if (isNaN(valAsNumber)) {
    return false;
  }

  return valAsNumber <= Number(ruleObj.params[0]);
};

const message = '<%= propertyName %> must be less than or equal to <%= ruleParams[0] %>.';

export default {validate, message};

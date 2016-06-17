import R from 'ramda';

const validate = (val, ruleObj) => {
  if (R.isNil(val)) {
    return false;
  }

  const valArray = R.is(Array, val) ? val : [val];
  const prefixList = ruleObj.params[0];

  return R.all(item => {
    const itemAsString = item.toString();
    const itemBeginsWith = R.compose(
      R.equals(0),
      R.indexOf(R.__, itemAsString)
    );

    return R.any(itemBeginsWith, prefixList);
  }, valArray);
};

const message = '<%= propertyName %> must begin with one of <%= ruleParams[0] %>.';

export default {validate, message};

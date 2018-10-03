import __ from 'ramda/src/__';
import all from 'ramda/src/all';
import any from 'ramda/src/any';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import indexOf from 'ramda/src/indexOf';
import is from 'ramda/src/is';
import isNil from 'ramda/src/isNil';

const validate = (val, ruleObj) => {
  if (isNil(val)) {
    return false;
  }

  const valArray = is(Array, val) ? val : [val];
  const prefixList = ruleObj.params[0];

  return all(item => {
    const itemAsString = item.toString();
    const itemBeginsWith = compose(
      equals(0),
      indexOf(__, itemAsString)
    );

    return any(itemBeginsWith, prefixList);
  }, valArray);
};

const message = '<%= propertyName %> must begin with one of <%= ruleParams[0] %>.';

export default {validate, message};

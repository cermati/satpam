import { Duration } from 'luxon';

const fullName = 'maxDuration:$1';

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  const duration = Duration.fromISO(val);
  const max = Duration.fromISO(ruleObj.params[0]);

  if (!duration.isValid || !max.isValid) {
    return false;
  }

  return duration.toMillis() <= max.toMillis();
};

const message = '<%= propertyName %> must be at most <%= ruleParams[0] %>.';

export default { fullName, validate, message };

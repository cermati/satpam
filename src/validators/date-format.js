import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const fullName = 'dateFormat:$1';

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  return dayjs(val, ruleObj.params[0], true).isValid();
};

const message = '<%= propertyName %> must be in format <%= ruleParams[0] %>.';

export default { fullName, validate, message };

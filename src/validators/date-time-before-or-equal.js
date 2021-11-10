import always from 'ramda/src/always';
import moment from 'moment';

const NOW = 'now';
const defaultMessage = '<%= propertyName %> must be less than or equal to <%= ruleParams[1] %>.';

// Use object (it will be passed as reference at index.js) to represent the message,
// because we want to change it dynamically based on the offset parameter
// based on the offset parameters.
const message = {};

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  let dateTime;
  const dateTimeInputFormat = ruleObj.params[0];
  const dateTimeInput = moment(val, dateTimeInputFormat);
  let offset = Number(ruleObj.params[2]);
  const unit = ruleObj.params[3] || 'seconds';

  if (ruleObj.params[1].toLowerCase() === NOW) {
    dateTime = moment();
  } else {
    dateTime = moment(ruleObj.params[1], dateTimeInputFormat);
  }

  // Always start with a defaultMessage
  message.toString = always(defaultMessage);

  if (offset) {
    if (offset < 0) {
      offset = Math.abs(offset);
      message.toString = always(
        '<%= propertyName %> must be less than or equal to <%= ruleParams[1] %> minus <%= Math.abs(ruleParams[2]) %> <%= ruleParams[3] %>.'
      );
      dateTime = dateTime.subtract(offset, unit);
    } else {
      message.toString = always('<%= propertyName %> must be less than or equal to <%= ruleParams[1] %> plus <%= ruleParams[2] %> <%= ruleParams[3] %>.');
      dateTime = dateTime.add(offset, unit);
    }
  }

  return dateTimeInput.isSameOrBefore(dateTime, unit);
};

export default {validate, message};

import always from 'ramda/src/always';
import join from 'lodash/join';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/id';

dayjs.extend(isSameOrAfter);
dayjs.extend(utc);

const fullName = 'timeAfterOrEqual:$1:$2:$3';

const NOW = 'NOW';
let messages;

// Use object (it will be passed as reference at index.js) to represent the message,
// because we want to change it dynamically.
const message = {};

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  messages = ['<%= propertyName %> must be greater than or equal to']

  const timeInput = dayjs(val);
  let offset = Number(ruleObj.params[1]);
  const unit = ruleObj.params[2];

  let time;

  if (ruleObj.params[0].toUpperCase() === NOW) {
    time = dayjs();

    messages.push(' now');
  } else {
    time = dayjs.unix(ruleObj.params[0]);

    messages.push(` ${dayjs.unix(ruleObj.params[0]).locale('id').utcOffset(7).format('YYYY-MM-DD HH:mm:ssZ')}`);
  }

  if (offset) {
    if (offset < 0) {
      offset = Math.abs(offset);
      time = time.subtract(offset, unit);

      messages.push(' minus <%= Math.abs(ruleParams[1]) %> <%= ruleParams[2] %>');
    } else {
      time = time.add(offset, unit);

      messages.push(' plus <%= ruleParams[1] %> <%= ruleParams[2] %>');
    }
  }

  messages.push('.');
  message.toString = always(join(messages, ''));

  return timeInput.isSameOrAfter(time);
};

export default { fullName, validate, message };

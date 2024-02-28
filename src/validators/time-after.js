import always from 'ramda/src/always';
import moment from 'moment';

import _ from 'lodash';

const fullName = 'timeAfter:$1:$2:$3';

const NOW = 'NOW';
let messages;

// Use object (it will be passed as reference at index.js) to represent the message,
// because we want to change it dynamically.
const message = {};

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  messages = ['<%= propertyName %> must be greater than'];

  const timeInput = moment(val);
  let offset = Number(ruleObj.params[1]);
  const unit = ruleObj.params[2];

  let time;

  if (ruleObj.params[0].toUpperCase() === NOW) {
    time = moment();

    messages.push(' now');
  } else {
    time = moment.unix(ruleObj.params[0]);

    messages.push(` ${moment.unix(ruleObj.params[0]).locale('id').utcOffset(7).format('YYYY-MM-DD HH:mm:ssZ')}`);
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
  message.toString = always(_.join(messages, ''));

  return timeInput.isAfter(time);
};

export default { fullName, validate, message };

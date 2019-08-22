import always from 'ramda/src/always';
import moment from 'moment';

import _ from 'lodash';

const NOW = 'now';
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

  if (ruleObj.params[0].toLowerCase() === NOW) {
    time = moment();

    messages.push(' now');
  } else {
    time = moment.unix(ruleObj.params[0]);

    messages.push(' <%= moment.unix(ruleParams[0]).format(\'YYYY-MM-DD HH:mm:ss\') %>');
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

export default {validate, message};

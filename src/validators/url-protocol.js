import _ from 'lodash';

const validate = (val, ruleObj) => {
  const validProtocol = _.chain(ruleObj)
    .get('params')
    .first()
    .value();

  let url;

  try {
    url = new URL(val);
  } catch(err) {
    return false;
  }

  // HACK: nodejs adds a trailing `:` in the protocol https://github.com/nodejs/node/pull/1237
  const protocol = url.protocol.slice(0, -1);

  return protocol === validProtocol;
};

const message = '<%= propertyName %> does not have a valid url protocol. It must be \'<%= ruleParams[0] %>\'.';

export default {validate, message};

import _ from '../utils/lodash-wrapper';

const fullName = 'urlProtocol:$1';

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

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

export default { fullName, validate, message };

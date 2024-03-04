import R from 'ramda';

const fullName = 'uuid:$1';

// A regex to check whether the given string is a valid uuid
// https://github.com/chriso/validator.js/blob/master/src/lib/isUUID.js
const uuid = {
  v1: /^[0-9A-F]{8}-[0-9A-F]{4}-1[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  v3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
  v4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  v5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
};

const validate = (val, ruleObj) => {
  if (R.isNil(val)) {
    return true;
  }

  const version = ruleObj.params[0] || 'all';

  return uuid[version].test(val.toString());
};

const message = '<%= propertyName %> field is not a valid UUID.';

export default { fullName, validate, message };

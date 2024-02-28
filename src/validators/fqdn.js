const fullName = 'fqdn';

const validate = val => {
  if (!val) {
    return true;
  }

  var parts = val.split('.');
  var tld = parts.pop();

  if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
    return false;
  }

  for (var part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-' ||
      part.indexOf('---') >= 0) {
      return false;
    }
  }

  return true;
};

const message = '<%= propertyName %> is not a valid FQDN.';

export default { fullName, validate, message };

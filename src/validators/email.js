/**
 * Validate email
 * This is a modified version of github.com/chriso/validator.js `isEmail`
 *
 * @param val
 * @returns {Boolean}
 */

const emailUserUtf8Regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))$/i;
import fqdn from './fqdn';

const validate = val => {
  if (!val) {
    return true;
  }

  if (/\s/.test(val)) {
    return false;
  }

  var parts = val.split('@');
  var domain = parts.pop();
  var user = parts.join('@');

  var lowerDomain = domain.toLowerCase();
  // Google mail ignore dot in email user, so foo.bar will be same as foobar
  // Read: http://webapps.stackexchange.com/questions/14668/why-does-google-not-consider-dot-in-usernames-of-gmail-addresses
  if (lowerDomain === 'gmail.com' || lowerDomain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }
  if (!fqdn.validate(domain)) {
    return false;
  }

  return emailUserUtf8Regex.test(user);
};

const message = '<%= propertyName %> must be email.';

export default {validate, message};

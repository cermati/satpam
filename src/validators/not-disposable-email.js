/**
 * Validate email by domain, domain should not disposable email provider
 * list are derived from multiple sources on internet
 *
 * best suited when pair with email validation
 *
 * @param val - email
 * @returns {Boolean}
 */

const DISPOSABLE_EMAIL_LIST = require('../data/disposable-email-list');
const DISPOSABLE_EMAIL_DOMAIN_SET = new Set(DISPOSABLE_EMAIL_LIST);

const validate = val => {
  if (!val) {
    return true;
  }

  if (/\s/.test(val)) {
    return false;
  }

  var parts = val.split('@');
  if (parts.length !== 2) {
    // most likely not email
    return false;
  }

  var domain = parts.pop();
  if (!domain) {
    return false;
  }

  var lowerDomain = domain.toLowerCase();

  return !DISPOSABLE_EMAIL_DOMAIN_SET.has(lowerDomain);
};

const message = '<%= propertyName %> domain not valid.';

export default {validate, message};

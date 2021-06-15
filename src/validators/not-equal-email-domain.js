import _ from 'lodash';

/**
 * Validate email's domain to not equal to the listed domains
 * in ruleObj.params[0]. Separate the domains using comma (,).
 *
 * @param val - email
 * @param ruleObj
 *
 * @returns {Boolean}
 */

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  const parts = val.split('@');

  if (parts.length !== 2) {
    // most likely not email
    return false;
  }

  const domain = parts.pop();

  if (!domain) {
    return false;
  }

  const lowerDomain = domain.toLowerCase();

  const prohibitedDomains = _.chain(ruleObj.params[0])
    .toLower()
    .split(',')
    .map(domain => _.trim(domain))
    .compact()
    .value();

  return !_.includes(prohibitedDomains, lowerDomain);
};

const message = '<%= propertyName %>\'s domain is not valid.';

export default {validate, message};

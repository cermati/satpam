const regexp = /(?!^([^a-zA-Z]|[\d\s])+$)^.+$/;

/**
 * Check the validity of supplied address
 *   - Reject if only consist of numbers, special and whitespace characters
 *   - Reject if line terminator exist
 *
 * @param {String} address
 * @returns {Boolean}
 */
const validate = address => {
  if (!address) {
    return true;
  }

  return regexp.test(address);
};

const message = '<%= propertyName %> is not a valid address.';

export default {validate, message};

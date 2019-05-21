const regexp = /^[a-zA-Z][a-zA-Z\\.\\-\\s]*$/;

/**
 * Check the validity of supplied name
 *   - Accept letters
 *   - Accept spaces
 *   - Accept special characters: . and -
 *   - Reject numbers
 *
 * @param {String} name
 * @returns {Boolean}
 */
const validate = name => {
  if (name) {
    return regexp.test(name);
  }

  return true;
};

const message = '<%= propertyName %> is not a valid name.';

export default {validate, message};

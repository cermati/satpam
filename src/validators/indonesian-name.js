const fullName = 'indonesianName';

const regexp = /^[a-zA-Z][a-zA-Z\.\-\'\,/\s]*$/;

/**
 * Check the validity of supplied name
 *   - Accept letters
 *   - Accept spaces
 *   - Accept special characters: dot, dash, coma, apostrophe
 *   - Reject numbers
 *
 * @param {String} name
 * @returns {Boolean}
 */
const validate = name => {
  if (!name) {
    return true;
  }

  return regexp.test(name);
};

const message = '<%= propertyName %> is not a valid name.';

export default { fullName, validate, message };

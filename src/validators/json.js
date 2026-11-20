import _ from 'lodash';

import getFileBuffer from '../utils/get-file-buffer';

const fullName = 'json';

/**
 * @param {*} val
 * @returns {String|null} - the text to parse, or null if the value carries none
 */
const toText = val => {
  if (_.isString(val)) {
    return val;
  }

  const buffer = getFileBuffer(val);

  if (_.isNil(buffer)) {
    return null;
  }

  return buffer.toString();
};

/**
 * Pass when the value parses as JSON.
 *
 * Parsing rather than sniffing: JSON has no byte signature, and "unidentifiable" covers HTML,
 * JS, PHP and SVG just as much as it covers JSON.
 *
 * @param {String|Buffer|Object} val - JSON text, a Buffer, or an object carrying one under `buffer`
 * @returns {Boolean}
 */
const validate = val => {
  if (_.isNil(val)) {
    return true;
  }

  const text = toText(val);

  if (_.isNil(text)) {
    return false;
  }

  try {
    JSON.parse(text);
  } catch (error) {
    return false;
  }

  return true;
};

const message = '<%= propertyName %> must be valid JSON.';

export default { fullName, validate, message };
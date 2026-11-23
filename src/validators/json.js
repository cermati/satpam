import _ from 'lodash';

import getFileBuffer from '../utils/get-file-buffer';

const fullName = 'json';

// U+FEFF, which Windows tools (Notepad, Excel's UTF-8 export) write at the start of a file
const BYTE_ORDER_MARK = '\uFEFF';

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
 * A leading byte order mark is ignored, because `JSON.parse` rejects it even though the rest of
 * the file is valid JSON. Callers that parse the same bytes afterwards must strip it too.
 *
 * There is no size limit here; cap uploads before they are buffered (e.g. multer `limits.fileSize`).
 *
 * @param {String|Buffer|Uint8Array|Object} val - JSON text, the bytes, or an object carrying them
 *   under `buffer`
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
    JSON.parse(_.trimStart(text, BYTE_ORDER_MARK));
  } catch {
    return false;
  }

  return true;
};

const message = '<%= propertyName %> must be valid JSON.';

export default { fullName, validate, message };

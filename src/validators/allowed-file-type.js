import _ from 'lodash';

import getFileBuffer from '../utils/get-file-buffer';

const fullName = 'allowedFileType:$1';

// Node versions that can `require()` an ES module without a flag, which file-type v22 needs
const MINIMUM_NODE_VERSION = '>=22.12.0';

/**
 * Load file-type v22's detector on first use.
 *
 * Required here rather than imported at the top: file-type v22 is ESM-only, and a top-level
 * import would make every service that loads satpam need a recent Node, not only the ones that
 * use this rule.
 *
 * On a Node too old to `require()` an ES module, the raw `ERR_REQUIRE_ESM` does not say which
 * rule caused it or what to upgrade to, so it is rethrown with that spelled out. Any other load
 * failure is passed through untouched.
 *
 * @returns {Function} - file-type's `fileTypeFromBuffer`
 */
const loadFileTypeFromBuffer = () => {
  try {
    return require('file-type-v22').fileTypeFromBuffer;
  } catch (error) {
    if (error.code !== 'ERR_REQUIRE_ESM') {
      throw error;
    }

    throw new Error(
      `allowedFileType needs Node ${MINIMUM_NODE_VERSION} (file-type v22 is ESM-only), running on Node ${process.version}.`,
      { cause: error }
    );
  }
};

/**
 * Pass when the value's own bytes sniff to one of the allowed mime types. The client-supplied
 * file name and `Content-Type` are never consulted.
 *
 * `null` in the allowed list means "content `file-type` cannot identify", which covers plain
 * text and CSV but equally HTML, PHP, JS and SVG — only allow it for fields that genuinely take
 * text.
 *
 * Async: only usable through `validateAsync`.
 *
 * @param {Buffer|Object} val - a Buffer, or an object carrying one under `buffer`
 * @param {Object} ruleObj - `params[0]` is a mime type or a list of them
 * @returns {Promise<Boolean>}
 */
const validate = async (val, ruleObj) => {
  if (_.isNil(val)) {
    return true;
  }

  const buffer = getFileBuffer(val);

  // A missing value is left to `required`, but a file that was sent with no bytes is never a valid file of any type.
  if (_.isNil(buffer) || buffer.length === 0) {
    return false;
  }

  const fileTypeFromBuffer = loadFileTypeFromBuffer();
  const detectedMimeType = _.get(await fileTypeFromBuffer(buffer), 'mime', null);

  return _.includes(_.castArray(ruleObj.params[0]), detectedMimeType);
};

const message = '<%= propertyName %> is not an allowed file type.';

export default { fullName, validate, message };

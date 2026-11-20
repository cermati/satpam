import _ from 'lodash';

import getFileBuffer from '../utils/get-file-buffer';

const fullName = 'allowedFileType:$1';

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

  if (_.isNil(buffer)) {
    return false;
  }

  // Required here rather than imported at the top: file-type v22 is ESM-only and needs Node >= 22,
  // and a top-level import would impose that on every service that loads satpam, not only the
  // ones that use this rule.
  // eslint-disable-next-line global-require
  const { fileTypeFromBuffer } = require('file-type-v22');
  const detectedMimeType = _.get(await fileTypeFromBuffer(buffer), 'mime', null);

  return _.includes(_.castArray(ruleObj.params[0]), detectedMimeType);
};

const message = '<%= propertyName %> is not an allowed file type.';

export default { fullName, validate, message };
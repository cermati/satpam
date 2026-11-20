import _ from 'lodash';

/**
 * Pull the raw bytes out of a value a file rule was given: a Buffer as-is, or the `buffer` of an
 * in-memory upload (multer's memoryStorage file object). Anything else has no bytes to check.
 *
 * Path-based input is deliberately not supported, unlike the older `fileType` and `image` rules:
 * uploads in our services are buffered in memory, and reading arbitrary paths from a validator
 * input is a liability.
 *
 * @param {*} val
 * @returns {Buffer|null}
 */
const getFileBuffer = val => {
  if (Buffer.isBuffer(val)) {
    return val;
  }

  if (_.isObject(val) && Buffer.isBuffer(val.buffer)) {
    return val.buffer;
  }

  return null;
};

export default getFileBuffer;
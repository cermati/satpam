import _ from 'lodash';

/**
 * Turn one candidate value into a Buffer, if it holds bytes at all.
 *
 * A Buffer is returned as-is. Any other Uint8Array (what `fetch`, Web Streams and many libraries
 * hand back) is wrapped without copying, using only its own slice of the underlying memory —
 * a view can start partway into a larger ArrayBuffer, so `bytes.buffer` alone would be wrong.
 *
 * @param {*} bytes
 * @returns {Buffer|null}
 */
const toBuffer = bytes => {
  if (Buffer.isBuffer(bytes)) {
    return bytes;
  }

  if (bytes instanceof Uint8Array) {
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  return null;
};

/**
 * Pull the raw bytes out of a value a file rule was given: the bytes themselves (Buffer or
 * Uint8Array), or the `buffer` of an in-memory upload (multer's memoryStorage file object).
 * Anything else has no bytes to check.
 *
 * Path-based input is deliberately not supported, unlike the older `fileType` and `image` rules:
 * uploads in our services are buffered in memory, and reading arbitrary paths from a validator
 * input is a liability.
 *
 * @param {*} val
 * @returns {Buffer|null}
 */
const getFileBuffer = val => {
  // Checked before looking for a `buffer` property: every Uint8Array, Buffer included, has its own
  // `.buffer` (the underlying ArrayBuffer), which is not the file object shape this means.
  const directBytes = toBuffer(val);

  if (!_.isNil(directBytes)) {
    return directBytes;
  }

  if (_.isObject(val)) {
    return toBuffer(val.buffer);
  }

  return null;
};

export default getFileBuffer;

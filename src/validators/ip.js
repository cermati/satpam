/**
 * Validate IPv4
 * This is a modified version of github.com/chriso/validator.js `isIP` (version === 4)
 *
 * @param val
 * @returns {Boolean}
 */
function isIPv4(val) {
  // It will accept anything with three dots (.) and numeric digits
  const ipv4Regex = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
  if (!ipv4Regex.test(val)) {
    return false;
  }
  // This part of code do checking for any invalid IP address like 256.256.256.256
  var parts = val.split('.').sort(function (a, b) {
    return a - b;
  });
  return parts[3] <= 255;
}

/**
 * Validate IPv6
 * This is a modified version of github.com/chriso/validator.js `isIP` (version === 6)
 *
 * @param val
 * @returns {Boolean}
 */
function isIPv6(val) {
  const ipv6Block = /^[0-9A-F]{1,4}$/i;
  var blocks = val.split(':');
  var foundOmissionBlock = false; // marker to indicate ::

  // At least some OS accept the last 32 bits of an IPv6 address
  // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
  // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
  // and '::a.b.c.d' is deprecated, but also valid.
  var foundIPv4TransitionBlock = isIPv4(blocks[blocks.length - 1]);
  var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

  if (blocks.length > expectedNumberOfBlocks)
    return false;

  // initial or final ::
  if (val === '::') {
    return true;
  } else if (val.substr(0, 2) === '::') {
    blocks.shift();
    blocks.shift();
    foundOmissionBlock = true;
  } else if (val.substr(val.length - 2) === '::') {
    blocks.pop();
    blocks.pop();
    foundOmissionBlock = true;
  }

  for (var i = 0; i < blocks.length; ++i) {
    // test for a :: which can not be at the string start/end
    // since those cases have been handled above
    if (blocks[i] === '' && i > 0 && i < blocks.length -1) {
      if (foundOmissionBlock)
        return false; // multiple :: in address
      foundOmissionBlock = true;
    } else if (foundIPv4TransitionBlock && i == blocks.length - 1) {
      // it has been checked before that the last
      // block is a valid IPv4 address
    } else if (!ipv6Block.test(blocks[i])) {
      return false;
    }
  }

  if (foundOmissionBlock) {
    return blocks.length >= 1;
  }
  return blocks.length === expectedNumberOfBlocks;
}

const validate = val => {
  if (!val) {
    return true;
  }

  return isIPv4(val) || isIPv6(val);
};

const message = '<%= propertyName %> is not a valid IP address.';

export default {validate, message};


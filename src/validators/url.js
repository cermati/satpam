/**
 * Validate url
 * This is a modified version of github.com/chriso/validator.js `isUrl`,
 *
 * @param val
 * @returns {Boolean}
 */

import ip from './ip';
import fqdn from './fqdn';

const fullName = 'url';

const validate = val => {
  if (!val) {
    return true;
  }

  // Check length
  if (val.length >= 2083 || /\s/.test(val)) {
    return false;
  }

  // Check for mailto: (it's email address not an url!)
  if (val.indexOf('mailto:') === 0) {
    return false;
  }

  var split = val.split('://');

  // Check protocol (only allow 'http', 'https', 'ftp')
  if (split.length > 1) {
    var protocols = ['http', 'https', 'ftp'];
    var protocol = split.shift();
    if (protocols.indexOf(protocol) === -1) {
      return false;
    }
  }

  val = split.join('://');
  split = val.split('#');
  val = split.shift();

  split = val.split('?');
  val = split.shift();

  split = val.split('/');
  val = split.shift();
  split = val.split('@');

  if (split.length > 1) {
    var auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }

  var hostname = split.join('@');
  split = hostname.split(':');
  var host = split.shift();

  // Check for url port (port must be a number range from 0 to 65535)
  if (split.length) {
    var port_str = split.join(':');
    var port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }

  // Check for host, it can be an IP address (IPv4 or IPv6), FQDN (Fully Qualified Domain Name), or 'localhost'
  return ip.validate(host) || fqdn.validate(host) || host === 'localhost';
};

const message = '<%= propertyName %> is not a valid url.';

export default { fullName, validate, message };

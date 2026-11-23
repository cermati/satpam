import _ from 'lodash';
import path from 'path';

const fullName = 'fileExtension:$1';

/**
 * Pass when the file name ends in one of the allowed extensions, case-insensitively.
 *
 * This only checks the name, which the client controls. Pair it with `allowedFileType` for
 * formats that cannot be identified from content alone (CSV), so a renamed image or archive is
 * still caught by the content check.
 *
 * @param {String|Object} val - a file name, or an object carrying one under `originalname`
 * @param {Object} ruleObj - `params[0]` is a dot-prefixed extension or a list of them
 * @returns {Boolean}
 */
const validate = (val, ruleObj) => {
  if (_.isNil(val)) {
    return true;
  }

  const fileName = _.isString(val) ? val : _.get(val, 'originalname');

  if (!_.isString(fileName)) {
    return false;
  }

  const extension = _.toLower(path.extname(fileName));
  const allowedExtensions = _.map(_.castArray(ruleObj.params[0]), _.toLower);

  return _.includes(allowedExtensions, extension);
};

const message = '<%= propertyName %> must have one of these extensions: <%= ruleParams[0] %>.';

export default { fullName, validate, message };

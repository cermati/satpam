import readChunk from 'read-chunk';
import imageType from 'image-type';
import _ from 'lodash/fp';

module.exports = {
  validator: val => {
    if (!val) {
      return true;
    }

    const pathToFile = _.isObject(val) ? val.path : val;
    const buffer = readChunk.sync(pathToFile, 0, 12);

    return imageType(buffer) !== null;
  },
  message: '<%= propertyName %> must be an image.'
};

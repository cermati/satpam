import readChunk from 'read-chunk';
import imageType from 'image-type';
import _ from 'lodash/fp';

const validate = val => {
  if (!val) {
    return true;
  }

  const pathToFile = _.isObject(val) ? val.path : val;
  const buffer = readChunk.sync(pathToFile, 0, 12);

  return imageType(buffer) !== null;
};

const message = '<%= propertyName %> must be an image.';

export default {validate, message};

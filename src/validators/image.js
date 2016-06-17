import readChunk from 'read-chunk';
import imageType from 'image-type';
import R from 'ramda';

const validate = val => {
  if (!val) {
    return true;
  }

  const pathToFile = R.is(Object, val) ? val.path : val;
  const buffer = readChunk.sync(pathToFile, 0, 12);

  return imageType(buffer) !== null;
};

const message = '<%= propertyName %> must be an image.';

export default {validate, message};

import readChunk from 'read-chunk';
import R from 'ramda';

const validate = val => {
  if (!val) {
    return true;
  }

  const pathToFile = R.is(Object, val) ? val.path : val;
  const buffer = readChunk.sync(pathToFile, 0, 12);

  console.log(buffer);

  return true;
};

const message = '<%= propertyName %> must be a pdf.';

export default {validate, message};


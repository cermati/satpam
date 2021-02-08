import readChunk from 'read-chunk';
import fileType from 'file-type';
import R from 'ramda';

const validate = (val, ruleObj) => {
  if (!val) {
    return true;
  }

  let buffer;

  if (R.is(Buffer, val)) {
    buffer = val.slice(0, 12);
  } else {
    const pathToFile = R.is(Object, val) ? val.path : val;
    buffer = readChunk.sync(pathToFile, 0, 12);
  }

  return R.path(['ext'], fileType(buffer)) === ruleObj.params[0];
};

const message = '<%= propertyName %> must be a(n) <%= ruleParams[0] %>.';

export default {validate, message};


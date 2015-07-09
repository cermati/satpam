var readChunk = require('read-chunk');
var imageType = require('image-type');
var _ = require('lodash');

exports = module.exports = {
  validator: function(val) {
    if (val) {
      if (_.isObject(val)) {
        val = val.path;
      }

      var buffer = readChunk.sync(val, 0, 12);

      return imageType(buffer) !== null;
    }

    return true;
  },
  message: '<%= propertyName %> must be an image.'
};

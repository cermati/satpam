var readChunk = require('read-chunk');
var imageType = require('image-type');

exports = module.exports = {
  validator: function(val) {
    if (val) {
      var buffer = readChunk.sync(val, 0, 12);

      return imageType(buffer) !== null;
    }

    return true;
  },
  message: '<%= propertyName %> must be an image.'
};
